import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { ReferralSent } from '../docs.interface';
import { FacilityService } from '../facility.service';
import { Store } from '../store.service';
const currentDate = new Date();
@Component({
  selector: 'app-facility-referral-sent',
  templateUrl: './facility-referral-sent.component.html',
  styleUrls: ['./facility-referral-sent.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityReferralSentComponent implements OnInit, OnDestroy {
  referralSent$: Observable<Array<any>>;
  throttle = 10;
  scrollDistance = 0.3;
  page = 0;
  all = [];
  recordCount: number;
  isEmpty = false;
  data = {
    facilityID: '',
    refercaseStatus: '',
    patientName: '',
    referbydoctorName: '',
    insuranceNames: '',
    patientGender: '',
    refercaseUrgent: '',
    reasonIDs: '',
    refercaseVisitTime: '',
    languageID: '1',
    doctorID: '',
    startDate: '',
    endDate: '',
    page: this.page.toString()
  };
  subscriptionInitial: Subscription;
  subscriptionUpdates: Subscription;
  subscriptionFilter: Subscription;
  subscriptionReset: Subscription;
  constructor(
    private service: HomeService,
    private facilityService: FacilityService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService,
    private store: Store
  ) { }

  async ngOnInit(): Promise<void> {
    // initialization
    this.data.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    // getting data
    this.referralSent$ = await this.getDataOnce() as Observable<ReferralSent[]>;
    this.subscriptionInitial = this.referralSent$.subscribe(res => {
      if (res) {
        this.all = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.all = [];
        this.cd.markForCheck();
      }
    }, (err) => {
      console.error(err);
    });
  }
  getDataOnce = () => {
    return this.facilityService.referralSent(JSON.stringify(this.data)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.isEmpty = c[0].recordcount > 0 ? true : false;
      }), map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<ReferralSent[]>;
  }
  onAppliedFilter = (filter: string) => {
    this.spinner.show();
    this.page = 0;
    this.data.page = this.page.toString();
    this.data.patientName = JSON.parse(filter).patientName ? JSON.parse(filter).patientName.trim() : '';
    this.data.patientGender = JSON.parse(filter).patientGender ? JSON.parse(filter).patientGender.trim() : '';
    this.data.referbydoctorName = JSON.parse(filter).doctorName ? JSON.parse(filter).doctorName.trim() : '';
    this.data.refercaseUrgent = JSON.parse(filter).refercaseUrgent ? 'Yes' : '';
    this.data.insuranceNames = JSON.parse(filter).insuranceNames ? JSON.parse(filter).insuranceNames.trim() : '';
    this.data.startDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.data.endDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.data.refercaseStatus = JSON.parse(filter).referStatus ? JSON.parse(filter).referStatus.trim() : '';
    this.referralSent$ = this.filter(JSON.stringify(this.data)) as Observable<ReferralSent[]>;
    this.subscriptionFilter = this.referralSent$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.all = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.all = [];
        this.cd.markForCheck();
      }
    }, (err) => {
      this.spinner.hide();
      console.error(err);
    });
  }
  onResetFilter = () => {
    this.spinner.show();
    this.page = 0;
    this.data.page = this.page.toString();
    this.data.patientName = '';
    this.data.patientGender = '';
    this.data.referbydoctorName = '';
    this.data.refercaseUrgent = '';
    this.data.insuranceNames = '';
    this.data.startDate = moment(currentDate).format('YYYY-MM-DD');
    this.data.endDate = '';
    this.data.refercaseStatus = '';
    this.referralSent$ = this.filter(JSON.stringify(this.data)) as Observable<ReferralSent[]>;
    this.subscriptionReset = this.referralSent$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.all = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.all = [];
        this.cd.markForCheck();
      }
    }, (err) => {
      this.spinner.hide();
      console.error(err);
    });
  }
  filter = (data: string) => {
    return this.facilityService.referralSentLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<ReferralSent[]>;
  }
  onScrollEnd = () => {
    if (this.recordCount !== this.all.length) {
      this.spinner.show();
      this.page++;
      this.data.page = this.page.toString();
      this.subscriptionUpdates = this.moreSentList(JSON.stringify(this.data))
        .subscribe((res) => {
          this.spinner.hide();
          this.all.push(...res);
          this.cd.markForCheck();
        }, (err) => {
          this.spinner.hide();
          console.error(err);
        });
    }
  }
  moreSentList = (data: string) => {
    return this.facilityService.referralSentLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<ReferralSent[]>;
  }
  showReferralClick = ($event: string) => {
    const data = { data: JSON.parse($event), from: 'sent' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/facility-referral-sent/view-refer']);
  }
  ngOnDestroy(): void {
    this.facilityService.destroySentList(); // destroying on-going subscription
    if (this.subscriptionUpdates) {
      this.subscriptionUpdates.unsubscribe();
    }
    if (this.subscriptionInitial) {
      this.subscriptionInitial.unsubscribe();
    }
    if (this.subscriptionFilter) {
      this.subscriptionFilter.unsubscribe();
    }
    if (this.subscriptionReset) {
      this.subscriptionReset.unsubscribe();
    }
  }
}
