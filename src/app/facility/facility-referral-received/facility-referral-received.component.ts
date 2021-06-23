import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { ReferralReceived } from '../docs.interface';
import { FacilityService } from '../facility.service';
import { Store } from '../store.service';
const currentDate = new Date();
@Component({
  selector: 'app-facility-referral-received',
  templateUrl: './facility-referral-received.component.html',
  styleUrls: ['./facility-referral-received.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityReferralReceivedComponent implements OnInit, OnDestroy {
  scheduledAll$: Observable<ReferralReceived[]>;
  forceReload$ = new Subject<void>();
  throttle = 10;
  scrollDistance = 0.3;
  page = 0;
  recordCount: number;
  isEmpty = false;
  all = [];
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
    startDate: '',
    endDate: '',
    languageID: '1',
    doctorID: '0',
    page: this.page.toString()
  };
  subscriptionInitial: Subscription;
  subscriptionUpdates: Subscription;
  subscriptionFilter: Subscription;
  subscriptionReset: Subscription;
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private store: Store
  ) { }

  ngOnInit(): void {
    // initialization
    this.data.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    this.data.startDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialValue$ = this.getDataOnce() as Observable<ReferralReceived[]>;
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce() as Observable<ReferralReceived[]>));
    this.scheduledAll$ = merge(initialValue$, updates$);
    this.subscriptionInitial = this.scheduledAll$.subscribe(res => {
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
    return this.facilityService.referralReceivedAll(JSON.stringify(this.data)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.isEmpty = c[0].recordcount > 0 ? true : false;
      }),
      map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  forceReload = () => {
    this.page = 0;
    this.data.page = this.page.toString();
    this.facilityService.forceReloadReceivedAll();
    this.forceReload$.next();
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
    this.scheduledAll$ = this.filter(JSON.stringify(this.data)) as Observable<Array<ReferralReceived>>;
    this.subscriptionFilter = this.scheduledAll$.subscribe((res) => {
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
    this.scheduledAll$ = this.filter(JSON.stringify(this.data)) as Observable<Array<ReferralReceived>>;
    this.subscriptionReset = this.scheduledAll$.subscribe((res) => {
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
  onScrollEnd = () => {
    if (this.recordCount !== this.all.length) {
      this.spinner.show();
      this.page++;
      this.data.page = this.page.toString();
      this.subscriptionUpdates = this.moreReceivedList(JSON.stringify(this.data))
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
  moreReceivedList = (data: string) => {
    return this.facilityService.referralReceivedLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<Array<ReferralReceived>>;
  }
  filter = (data: string) => {
    return this.facilityService.referralReceivedLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<Array<ReferralReceived>>;
  }
  showReferralClick = ($event: string) => {
    const data = { data: JSON.parse($event), from: 'received' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/facility-referral-received/view-refer']);
  }
  ngOnDestroy(): void {
    this.facilityService.destroyReceivedAll(); // destroying on-going subscription
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
