import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, merge, Subscription, of } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { ReferralReceived } from '../docs.interface';
import { FacilityService } from '../facility.service';
import { Store } from '../store.service';
const currentDate = new Date();
@Component({
  selector: 'app-previous',
  templateUrl: './previous.component.html',
  styleUrls: ['./previous.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviousComponent implements OnInit, OnDestroy {
  scheduledPrevious$: Observable<Array<any>>;
  forceReloadPrivious$ = new Subject<void>();
  recordCount: number;
  previousAll = [];
  subscriptionInitial: Subscription;
  subscriptionUpdates: Subscription;
  subscriptionFilter: Subscription;
  subscriptionReset: Subscription;
  throttle = 10;
  scrollDistance = 0.3;
  pagePrevious = 0;
  privious = {
    facilityID: '',
    refercaseStatus: 'Accepted',
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
    page: this.pagePrevious.toString()
  };
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private store: Store,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // initialization
    this.privious.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    this.privious.startDate = this.service.getFaLocal() ? moment(this.service.getFaLocal().facilityuserCreatedDate).format('YYYY-MM-DD')
      : moment(this.service.getFaSession().facilityuserCreatedDate).format('YYYY-MM-DD');
    this.privious.endDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialPrivious$ = this.getDataOncePrivious() as Observable<Array<ReferralReceived>>;
    const updatesPrivious$ = this.forceReloadPrivious$
      .pipe(mergeMap(() => this.getDataOncePrivious() as Observable<Array<ReferralReceived>>));
    this.scheduledPrevious$ = merge(initialPrivious$, updatesPrivious$);
    this.subscriptionInitial = this.scheduledPrevious$.subscribe((res) => {
      if (res) {
        this.previousAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.previousAll = [];
        this.cd.markForCheck();
      }
    }, err => console.error(err));
    this.facilityService.update.subscribe(filter => {
      if (filter) {
        this.onAppliedFilter(filter);
      }
    });
    this.facilityService.reset.subscribe(reset => {
      if (reset) {
        this.onResetFilter();
      }
    });
    this.facilityService.sortData.subscribe(sort => {
      if (sort) {
        this.onAppliedSorting(sort);
      }
    });
  }
  onAppliedFilter = (filter: string) => {
    this.pagePrevious = 0;
    this.privious.page = this.pagePrevious.toString();
    this.privious.patientName = JSON.parse(filter).patientName ? JSON.parse(filter).patientName.trim() : '';
    this.privious.patientGender = JSON.parse(filter).patientGender ? JSON.parse(filter).patientGender.trim() : '';
    this.privious.referbydoctorName = JSON.parse(filter).doctorName ? JSON.parse(filter).doctorName.trim() : '';
    this.privious.refercaseUrgent = JSON.parse(filter).refercaseUrgent ? 'Yes' : '';
    this.privious.insuranceNames = JSON.parse(filter).insuranceNames ? JSON.parse(filter).insuranceNames.trim() : '';
    this.privious.startDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.privious.endDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.scheduledPrevious$ = this.filter(JSON.stringify(this.privious)) as Observable<Array<ReferralReceived>>;
    this.subscriptionFilter = this.scheduledPrevious$.subscribe((res) => {
      if (res) {
        this.previousAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.previousAll = [];
        this.cd.markForCheck();
      }
    }, err => console.error(err));
  }
  onAppliedSorting = (sorting: string) => {
    this.pagePrevious = 0;
    this.privious.page = this.pagePrevious.toString();
    this.privious.patientName = '';
    this.privious.patientGender = '';
    this.privious.referbydoctorName = '';
    this.privious.refercaseUrgent = '';
    this.privious.insuranceNames = '';
    this.privious.startDate = JSON.parse(sorting).startDate ? JSON.parse(sorting).startDate : '';
    this.privious.endDate = JSON.parse(sorting).endDate ? JSON.parse(sorting).endDate : '';
    this.scheduledPrevious$ = this.filter(JSON.stringify(this.privious)) as Observable<Array<ReferralReceived>>;
    this.subscriptionFilter = this.scheduledPrevious$.subscribe((res) => {
      if (res) {
        this.previousAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.previousAll = [];
        this.cd.markForCheck();
      }
    }, err => console.error(err));
  }
  onResetFilter = () => {
    this.pagePrevious = 0;
    this.privious.page = this.pagePrevious.toString();
    this.privious.patientName = '';
    this.privious.patientGender = '';
    this.privious.referbydoctorName = '';
    this.privious.refercaseUrgent = '';
    this.privious.insuranceNames = '';
    this.privious.startDate = this.service.getFaLocal() ? moment(this.service.getFaLocal().facilityuserCreatedDate).format('YYYY-MM-DD')
      : moment(this.service.getFaSession().facilityuserCreatedDate).format('YYYY-MM-DD');
    this.privious.endDate = moment(currentDate).format('YYYY-MM-DD');
    this.scheduledPrevious$ = this.filter(JSON.stringify(this.privious)) as Observable<Array<ReferralReceived>>;
    this.subscriptionReset = this.scheduledPrevious$.subscribe((res) => {
      if (res) {
        this.previousAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.previousAll = [];
        this.cd.markForCheck();
      }
    }, err => console.error(err));
    this.cd.markForCheck();
  }
  filter = (data: string) => {
    return this.facilityService.referralReceivedLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
      this.spinner.hide();
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<Array<ReferralReceived>>;
  }
  getDataOncePrivious = () => {
    return this.facilityService.referralReceivedPrivious(JSON.stringify(this.privious)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.facilityService.showPreviousFiler(c[0].recordcount > 0 ? true : false);
      }),
      map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<Array<ReferralReceived>>;
  }
  forceReloadPrivious = () => {
    this.pagePrevious = 0;
    this.privious.page = this.pagePrevious.toString();
    this.facilityService.forceReloadPrivious();
    this.forceReloadPrivious$.next();
  }
  // for previous
  onScrollEndPrevious = () => {
    if (this.recordCount !== this.previousAll.length) {
      this.spinner.show();
      this.pagePrevious++;
      this.privious.page = this.pagePrevious.toString();
      this.subscriptionUpdates = this.morePreviousList(JSON.stringify(this.privious))
        .subscribe((res) => {
          res.map(v => this.previousAll.push(v));
          this.cd.markForCheck();
        },
          () => this.spinner.hide(),
          () => this.spinner.hide()
        );
    }
  }
  morePreviousList = (post: string) => {
    return this.facilityService.referralReceivedLists(post).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
      this.spinner.hide();
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<Array<ReferralReceived>>;
  }
  showReferralClick = ($event: string) => {
    const data = { data: JSON.parse($event), url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/my-schedule-view-refer']);
  }
  ngOnDestroy(): void {
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
