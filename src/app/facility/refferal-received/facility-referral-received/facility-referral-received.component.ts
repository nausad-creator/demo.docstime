import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { ReferralReceived } from 'src/app/docs/docs.interface';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../../facility.service';
import { Store } from '../../store.service';
const currentDate = new Date();
@Component({
  selector: 'app-facility-referral-received',
  template: `<body class="dashbord-section">
  <div class="spacetop"></div>
  <section class="section-dashbord overflow-hidden">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-8 appointment-conten order-2 order-lg-1 pt-3">
          <app-shared-filter [component]="'received'" (filter)="onAppliedFilter($event)" (resetFilter)="onResetFilter()"
            *ngIf="isEmpty"></app-shared-filter>
          <div class="appointmen-content appointmen-referral appoinment-show" *ngIf="all.length>0">
            <div infinite-scroll [infiniteScrollDistance]="scrollDistance" [infiniteScrollThrottle]="throttle"
              [scrollWindow]="true" (scrolled)="onScrollEnd()">
              <div class="details-list" *ngFor="let appoint of all">
                <app-share-referral-received
                  [patientFirstName]="appoint.patientFirstName ? appoint.patientFirstName : ''"
                  [patientLastName]="appoint.patientLastName ? appoint.patientLastName : ''"
                  [reasonName]="appoint.reasonName ? appoint.reasonName : appoint.reasonNames ? appoint.reasonNames : ''"
                  [patientGender]="appoint.patientGender ? appoint.patientGender : ''"
                  [specialityName]="appoint.specialityName ? appoint.specialityName : ''"
                  [doctorFullName]="appoint.doctorFullName ? appoint.doctorFullName : ''"
                  [refercaseUrgent]="appoint.refercaseUrgent ? appoint.refercaseUrgent : ''"
                  [refercaseSentTZID]="appoint.refercaseSentTZID ? appoint.refercaseSentTZID : ''"
                  [doctorProfileImage]="appoint.doctorProfileImage ? appoint.doctorProfileImage : ''"
                  [age]="appoint.age ? appoint.age : '0'" [refercaseID]="appoint.refercaseID ? appoint.refercaseID : ''"
                  [facilityID]="appoint.facilityID ? appoint.facilityID : ''"
                  [doctorID]="appoint.doctorID ? appoint.doctorID : ''"
                  [refSpecialityName]="appoint.insuranceNames ? appoint.insuranceNames : ''"
                  [refercaseVisitDate]="appoint.refercaseVisitDate ? appoint.refercaseVisitDate : ''"
                  [refercaseVisitTime]="appoint.refercaseVisitTime !== null && appoint.refercaseVisitTime !== Undefined && appoint.refercaseVisitTime !== '' ? appoint.refercaseVisitTime : ''"
                  [refercaseStatus]="appoint.refercaseStatus ? appoint.refercaseStatus : ''" [wholeObject]="appoint"
                  (view)="showReferralClick($event)" (updateView)="forceReload()">
                </app-share-referral-received>
              </div>
            </div>
            <div class="row" style="min-height: 250px;" *ngIf="all.length > 0 && all.length <= 3">
              <div class="">
                <div class="text-center">
                  <p></p>
                </div>
              </div>
            </div>
            <div *ngIf="all.length > 0 && all.length <= 2" style="height: 350px;">
              <div class="text-center">
                <p></p>
              </div>
            </div>
          </div>
          <div class="" style="margin-top: 5px;" *ngIf="(scheduledAll$ | async) === null">
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
          <div class="" style="margin-top: 40px; height: 500px" *ngIf="(scheduledAll$ | async) === undefined">
            <div class="row">
              <div class="col">
                <img class="img-center pt-3 pt-lg-5" src="assets/img/no-data.png" alt="No-Data">
                <p class="text-center" style="padding-right:32px;">No Record Found.</p>
              </div>
            </div>
          </div>

        </div>
        <div class="col-xl-4 col-lg-4 uploadfile-conten order-1 order-lg-2 card" style="border-radius:0;">
          <div class=" wow zoomIn pt-3" data-wow-delay="0.2s">
            <app-share-datetimepicker [from]="'Received'"></app-share-datetimepicker>
          </div>
        </div>
      </div>
    </div>
  </section>
  <br>
</body>`,
  styles: [`.cursr{
    cursor: pointer;
}
.ng-select.customSpeciality ::ng-deep .ng-select-container {
    border: 1px solid #f0e9ff;
  }
  .ng-select.custom2 ::ng-deep .ng-select-container {
    border: 1px solid #f0e9ff;
    cursor: default;
    display: flex;
    outline: none;
    overflow: hidden;
    position: relative;
    width: 100%;
    border: 1px solid #f0e9ff;
    border-radius: 5px;
    height: 48px;
    padding-left: 8px;
    font-size: 13px;
  }
  .ng-select.ng-select-single.custom ::ng-deep .ng-select-container {
    border: 1px solid #f0e9ff;
    border-radius: 5px;
    height: 48px;
    padding-left: 18px;
    font-size: 13px;
    padding-right: 5px;
  }
  .ng-select.ng-select-single.custom ::ng-deep .ng-select-container .ng-value-container .ng-input {
    left: 0;
    padding-left: 18px;
    padding-right: 50px
  }
  .ng-select.custom ::ng-deep .ng-select-container .ng-value-container {
    align-items: center;
    padding-left: 0px;
  }
  .ng-select.ng-select-single.custom ::ng-deep .ng-value-container .ng-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ng-select.custom ::ng-deep .ng-clear-wrapper {
    margin-top: 3px;
  }
  .ng-select.customSpeciality ::ng-deep .ng-clear-wrapper {
    margin-top: 3.5px;
  }
  `],
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
