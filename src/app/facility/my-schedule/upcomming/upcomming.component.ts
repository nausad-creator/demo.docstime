import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, merge, Subscription, of } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { ReferralReceived } from 'src/app/docs/docs.interface';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../../facility.service';
import { Store } from '../../store.service';
const currentDate = new Date();
@Component({
  selector: 'app-upcomming',
  template: `<div class="tab-pane fade show active" id="Upcoming" role="tabpanel" aria-labelledby="home-tab">
  <div class="appointmen-content" *ngIf="scheduledAll.length>0">
    <div
infinite-scroll
[infiniteScrollDistance]="scrollDistance"
[infiniteScrollThrottle]="throttle"
[scrollWindow]="true"
(scrolled)="onScrollEndScheduled()">
<div class="details-list" *ngFor="let appoint of scheduledAll">
  <app-share-schedule-appointments
    [patientFirstName]="appoint.patientFirstName ? appoint.patientFirstName : ''"
    [patientLastName]="appoint.patientLastName ? appoint.patientLastName : ''"
    [specialityName]="appoint.specialityName ? appoint.specialityName : ''"
    [doctorFullName]="appoint.doctorFullName ? appoint.doctorFullName : ''"
    [doctorProfileImage]="appoint.doctorProfileImage ? appoint.doctorProfileImage : ''"
    [reasonName]="appoint.reasonName ? appoint.reasonName : appoint.reasonNames ? appoint.reasonNames : ''"
    [patientGender]="appoint.patientGender ? appoint.patientGender : ''"
    [age]="appoint.age ? appoint.age : '0'" [wholeObject]="appoint"
    [refercaseUrgent]="appoint.refercaseUrgent ? appoint.refercaseUrgent : ''"
    [refSpecialityName]="appoint.insuranceNames ? appoint.insuranceNames : ''"
    [refercaseVisitDate]="appoint.refercaseVisitDate ? appoint.refercaseVisitDate : ''"
    [refercaseVisitTime]="appoint.refercaseVisitTime !== null && appoint.refercaseVisitTime !== Undefined && appoint.refercaseVisitTime !== '' ? appoint.refercaseVisitTime : ''"
    [refercaseStatus]="appoint.refercaseStatus ? appoint.refercaseStatus : ''"
    (view)="showReferralClick($event)">
  </app-share-schedule-appointments>
</div>
</div>
    <div class="row" style="min-height: 250px;" *ngIf="scheduledAll.length >0 && scheduledAll.length <= 3">
      <div class="">
        <div class="text-center">
          <p></p>
        </div>
      </div>
    </div>
    <div *ngIf="scheduledAll.length > 0 && scheduledAll.length <= 2">
      <div style="height: 350px;">
        <p></p>
      </div>
    </div>
  </div>
  <div class="" style="margin-top: 5px;" *ngIf="(scheduledUpcomming$ | async) === null">
    <div class="appointmen-content appoinment-show appointmen-referral">
      <div class="details-list">
        <div class="appointmen-list card mb-3">
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '12px', width: '30%' }"></ngx-skeleton-loader>
          </div>
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
          </div>
            <div class="row align-items-center">
              <div class="col-md-5 text-appont">
                <ngx-skeleton-loader count="1" [theme]="{ height: '12px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '30%' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-3 icons-dated">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
            </div>
          </div>
      </div>
      <div class="details-list">
        <div class="appointmen-list card mb-3">
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '12px', width: '30%' }"></ngx-skeleton-loader>
          </div>
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
          </div>
            <div class="row align-items-center">
              <div class="col-md-5 text-appont">
                <ngx-skeleton-loader count="1" [theme]="{ height: '12px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '30%' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-3 icons-dated">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
            </div>
          </div>
      </div>
      <div class="details-list">
        <div class="appointmen-list card mb-3">
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '12px', width: '30%' }"></ngx-skeleton-loader>
          </div>
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
          </div>
            <div class="row align-items-center">
              <div class="col-md-5 text-appont">
                <ngx-skeleton-loader count="1" [theme]="{ height: '12px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '30%' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-3 icons-dated">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
            </div>
          </div>
      </div>
      <div class="details-list">
        <div class="appointmen-list card mb-3">
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '12px', width: '30%' }"></ngx-skeleton-loader>
          </div>
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
          </div>
            <div class="row align-items-center">
              <div class="col-md-5 text-appont">
                <ngx-skeleton-loader count="1" [theme]="{ height: '12px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '30%' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-3 icons-dated">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
            </div>
          </div>
      </div>
      <div class="details-list">
        <div class="appointmen-list card mb-3">
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '12px', width: '30%' }"></ngx-skeleton-loader>
          </div>
          <div class="text-appont">
            <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
          </div>
            <div class="row align-items-center">
              <div class="col-md-5 text-appont">
                <ngx-skeleton-loader count="1" [theme]="{ height: '12px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '30%' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px', width: '47%' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-3 icons-dated">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment">
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
                <ngx-skeleton-loader count="1" [theme]="{ height: '10px' }"></ngx-skeleton-loader>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
  <div class="" style="margin-top: 40px; height: 500px" *ngIf="(scheduledUpcomming$ | async) === undefined">
    <div class="row">
      <div class="col">
        <img class="img-center pt-3 pt-lg-5" src="assets/img/no-data.png" alt="No-Data">
        <p class="text-center" style="padding-right:32px;">No Record Found.</p>
      </div>
    </div>
  </div>
</div>`,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcommingComponent implements OnInit, OnDestroy {
  scheduledUpcomming$: Observable<ReferralReceived[]>;
  forceReloadUpcomming$ = new Subject<void>();
  scheduledAll = [];
  throttle = 10;
  scrollDistance = 0.3;
  pageSchedule = 0;
  recordCount: number;
  subscriptionInitial: Subscription;
  subscriptionUpdates: Subscription;
  subscriptionFilter: Subscription;
  subscriptionReset: Subscription;
  upcomming = {
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
    page: this.pageSchedule.toString()
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
    this.upcomming.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    this.upcomming.startDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialUpcomming$ = this.getDataOnceUpcomming() as Observable<ReferralReceived[]>;
    const updatesUpcomming$ = this.forceReloadUpcomming$.pipe(mergeMap(() => this.getDataOnceUpcomming() as Observable<ReferralReceived[]>));
    this.scheduledUpcomming$ = merge(initialUpcomming$, updatesUpcomming$);
    this.subscriptionReset = this.scheduledUpcomming$.subscribe((res) => {
      if (res) {
        this.scheduledAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.scheduledAll = [];
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
  getDataOnceUpcomming = () => {
    return this.facilityService.referralReceivedUpcomming(JSON.stringify(this.upcomming)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.facilityService.showUpcommingFiler(c[0].recordcount > 0 ? true : false);
      }),
      map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  forceReloadUpcomming = () => {
    this.pageSchedule = 0;
    this.upcomming.page = this.pageSchedule.toString();
    this.facilityService.forceReloadUpcomming();
    this.forceReloadUpcomming$.next();
  }
  onAppliedFilter = (filter: string) => {
    this.pageSchedule = 0;
    this.upcomming.page = this.pageSchedule.toString();
    this.upcomming.patientName = JSON.parse(filter).patientName ? JSON.parse(filter).patientName.trim() : '';
    this.upcomming.patientGender = JSON.parse(filter).patientGender ? JSON.parse(filter).patientGender.trim() : '';
    this.upcomming.referbydoctorName = JSON.parse(filter).doctorName ? JSON.parse(filter).doctorName.trim() : '';
    this.upcomming.refercaseUrgent = JSON.parse(filter).refercaseUrgent ? 'Yes' : '';
    this.upcomming.insuranceNames = JSON.parse(filter).insuranceNames ? JSON.parse(filter).insuranceNames.trim() : '';
    this.upcomming.startDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.upcomming.endDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.scheduledUpcomming$ = this.filter(JSON.stringify(this.upcomming)) as Observable<ReferralReceived[]>;
    this.subscriptionFilter = this.scheduledUpcomming$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.scheduledAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.scheduledAll = [];
        this.cd.markForCheck();
      }
    }, err => {
      this.spinner.hide();
      console.error(err);
    });
  }
  onAppliedSorting = (sorting: string) => {
    this.pageSchedule = 0;
    this.upcomming.page = this.pageSchedule.toString();
    this.upcomming.patientName = '';
    this.upcomming.patientGender = '';
    this.upcomming.referbydoctorName = '';
    this.upcomming.refercaseUrgent = '';
    this.upcomming.insuranceNames = '';
    this.upcomming.startDate = JSON.parse(sorting).startDate ? JSON.parse(sorting).startDate : '';
    this.upcomming.endDate = JSON.parse(sorting).endDate ? JSON.parse(sorting).endDate : '';
    this.scheduledUpcomming$ = this.filter(JSON.stringify(this.upcomming)) as Observable<ReferralReceived[]>;
    this.subscriptionFilter = this.scheduledUpcomming$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.scheduledAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.scheduledAll = [];
        this.cd.markForCheck();
      }
    }, err => {
      this.spinner.hide();
      console.error(err);
    });
  }
  onResetFilter = () => {
    this.pageSchedule = 0;
    this.upcomming.page = this.pageSchedule.toString();
    this.upcomming.patientName = '';
    this.upcomming.patientGender = '';
    this.upcomming.referbydoctorName = '';
    this.upcomming.refercaseUrgent = '';
    this.upcomming.insuranceNames = '';
    this.upcomming.startDate = moment(currentDate).format('YYYY-MM-DD');
    this.upcomming.endDate = '';
    this.scheduledUpcomming$ = this.filter(JSON.stringify(this.upcomming)) as Observable<ReferralReceived[]>;
    this.subscriptionReset = this.scheduledUpcomming$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.scheduledAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.scheduledAll = [];
        this.cd.markForCheck();
      }
    }, err => {
      this.spinner.hide();
      console.error(err);
    });
  }
  filter = (data: string) => {
    return this.facilityService.referralReceivedLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  // for more schedule
  onScrollEndScheduled = () => {
    if (this.recordCount !== this.scheduledAll.length) {
      this.spinner.show();
      this.pageSchedule++;
      this.upcomming.page = this.pageSchedule.toString();
      this.subscriptionUpdates = this.moreScheduledList(JSON.stringify(this.upcomming)).subscribe((res) => {
        this.spinner.hide();
        this.scheduledAll.push(...res);
        this.cd.markForCheck();
      }, (err) => {
        this.spinner.hide();
        console.error(err);
      });
    }
  }
  moreScheduledList = (data: string) => {
    return this.facilityService.referralReceivedLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  showReferralClick = ($event: string) => {
    const data = { data: JSON.parse($event), url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/facility-my-schedule/view-refer']);
  }
  ngOnDestroy(): void {
    this.facilityService.destroyUpcoming(); // destroying on-going subscription
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
