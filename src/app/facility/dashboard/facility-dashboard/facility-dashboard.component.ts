import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, Subject, merge, of } from 'rxjs';
import { take, mergeMap, map, catchError, tap } from 'rxjs/operators';
import { Dashboard } from 'src/app/docs/docs.interface';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../../facility.service';
import { Store } from '../../store.service';

@Component({
  selector: 'app-facility-dashboard',
  template: `<body class="dashbord-section">
  <div class="spacetop"></div>
  <section class="section-dashbord overflow-hidden">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-8 appointment-conten order-2 order-lg-1 pt-3">
          <div class="title-dashbord d-flex">
            <h4 class="text-dark">{{fullDate | date: 'fullDate'}}</h4>
            <div class="ml-auto">
              <div class="d-flex">
                <app-shared-filter [component]="'home'" (filter)="onAppliedFilter($event)"
                  (resetFilter)="onResetFilter()" *ngIf="isToday || isOther"></app-shared-filter>
                <a (click)="navigateToMySchedule()" class="viewall-btn mb-0 ml-3" style="cursor: pointer;"
                  *ngIf="(today$ | async)?.length > 0">View All<i class="ti-angle-right"></i></a>
              </div>
            </div>
          </div>
          <div class="selected-users">
            <div *ngIf="today$ | async as today" class="wow fadeInRight" data-wow-delay="0.2s">
              <owl-carousel-o [options]="caseOptions">
                <ng-template carouselSlide *ngFor="let appoint of today | sortByTime">
                  <app-shared-today-appointment
                    [patientFirstName]="appoint.patientFirstName ? appoint.patientFirstName : ''"
                    [patientLastName]="appoint.patientLastName ? appoint.patientLastName : ''"
                    [reasonName]="appoint.reasonName ? appoint.reasonName : appoint.reasonNames ? appoint.reasonNames : ''"
                    [patientGender]="appoint.patientGender ? appoint.patientGender : ''"
                    [age]="appoint.age ? appoint.age : '0'"
                    [refSpecialityName]="appoint.insuranceNames ? appoint.insuranceNames : ''"
                    [refercaseVisitDate]="appoint.refercaseVisitDate ? appoint.refercaseVisitDate : ''"
                    [refercaseVisitTime]="appoint.refercaseVisitTime !== null && appoint.refercaseVisitTime !== undefined ? appoint.refercaseVisitTime : ''"
                    [refercaseStatus]="appoint.refercaseStatus ? appoint.refercaseStatus : ''" [wholeOBject]="appoint"
                    (view)="showReferralClick($event)">
                  </app-shared-today-appointment>
                </ng-template>
              </owl-carousel-o>
            </div>
            <div class="" style="margin-top: 0px;" *ngIf="(today$ | async) === null">
              <div class="row">
                <div class="col-md-6">
                  <ngx-skeleton-loader count="1" [theme]="{ height: '95px', 'margin-bottom': '0px' }">
                  </ngx-skeleton-loader>
                </div>
                <div class="col-md-6">
                  <ngx-skeleton-loader count="1" [theme]="{ height: '95px', 'margin-bottom': '0px' }">
                  </ngx-skeleton-loader>
                </div>
              </div>
            </div>
            <div class="" style="margin-top: 20px; margin-bottom: 1rem;" *ngIf="(today$ | async)?.length === 0">
              <div class="row">
                <div class="col">
                  <p class="text-center sb-text mb-0" style="line-height:normal">No docstime referrals today</p>
                  <p class="text-center" style="line-height: normal;">Currently we have nothing to show</p>
                </div>
              </div>
            </div>
          </div>
          <div class="title-dashbord d-flex" style="margin-top: 20px;">
            <h4 class="text-dark">New Appointments</h4>
            <div class="ml-auto" *ngIf="(other$ | async)?.length > 0"><a (click)="navigateToreferralReceived()"
                class="viewall-btn" style="cursor: pointer;">View All<i class="ti-angle-right"></i></a></div>
          </div>
          <div class="appointmen-content" *ngIf="other$ | async as otherLists">
            <div infinite-scroll [infiniteScrollDistance]="scrollDistance" [infiniteScrollThrottle]="throttle"
              [scrollWindow]="true" (scrolled)="onScrollEnd()">
              <div class="details-list" *ngFor="let appoint of otherLists | slice:0:show">
                <app-shared-new-appointment
                  [patientFirstName]="appoint.patientFirstName ? appoint.patientFirstName : ''"
                  [patientLastName]="appoint.patientLastName ? appoint.patientLastName : ''"
                  [specialityName]="appoint.specialityName ? appoint.specialityName : ''"
                  [doctorFullName]="appoint.doctorFullName ? appoint.doctorFullName : ''"
                  [refercaseUrgent]="appoint.refercaseUrgent ? appoint.refercaseUrgent : ''"
                  [doctorProfileImage]="appoint.doctorProfileImage ? appoint.doctorProfileImage : ''"
                  [reasonName]="appoint.reasonName ? appoint.reasonName : appoint.reasonNames ? appoint.reasonNames : ''"
                  [patientGender]="appoint.patientGender ? appoint.patientGender : ''"
                  [age]="appoint.age ? appoint.age : '0'" [refercaseID]="appoint.refercaseID ? appoint.refercaseID : ''"
                  [facilityID]="appoint.facilityID ? appoint.facilityID : ''"
                  [refercaseSentTZID]="appoint.refercaseSentTZID ? appoint.refercaseSentTZID : ''"
                  [doctorID]="appoint.doctorID ? appoint.doctorID : ''"
                  [refSpecialityName]="appoint.insuranceNames ? appoint.insuranceNames : ''"
                  [refercaseVisitDate]="appoint.refercaseVisitDate ? appoint.refercaseVisitDate : ''"
                  [refercaseVisitTime]="appoint.refercaseVisitTime !== null && appoint.refercaseVisitTime !== Undefined && appoint.refercaseVisitTime !== '' ? appoint.refercaseVisitTime : ''"
                  [refercaseStatus]="appoint.refercaseStatus ? appoint.refercaseStatus : ''" [wholeOBject]="appoint"
                  (view)="showReferralClick($event)" (updateView)="forceReload()"
                  (updateViewToday)="forceReloadToday()"></app-shared-new-appointment>
              </div>
            </div>
            <div class="row" style="min-height: 300px;" *ngIf="otherLists.length > 0 && otherLists.length <= 2">
              <div class="col-12">
                <div class="text-center">
                  <p></p>
                </div>
              </div>
            </div>
            <div class="row" style="min-height: 250px;" *ngIf="otherLists.length > 0 && otherLists.length === 3">
              <div class="col-12">
                <div class="text-center">
                  <p></p>
                </div>
              </div>
            </div>
          </div>
          <div class="" style="margin-top: 5px;" *ngIf="(other$ | async) === null">
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
          <div class="" style="margin-top: 20px; height: 500px;" *ngIf="(other$ | async)?.length === 0">
            <div class="row">
              <div class="col">
                <img class="img-center pt-3 pt-lg-5" src="assets/img/no-data.png" alt="No-Data">
                <p class="text-center sb-text" style="padding-right:32px; line-height:normal">No new DocsTime referrals.
                </p>
                <p class="text-center" style="padding-right:28px; line-height:normal">Currently we have nothing to show
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-4 col-lg-4 uploadfile-conten order-1 order-lg-2 card" style="border-radius:0;">
          <app-share-datetimepicker [from]="'Dashboard'"></app-share-datetimepicker>
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
  .updateHeight{
    min-height: 720px;
    position: relative;
  }
  .dis{
    border: 1px solid #999999;
    background-color: #cccccc;
    display: inline-block;
    border: 1px solid transparent;
    font-size: 15px;
    font-weight: 500;
    padding: 12px 54px;
    border-radius: 4px;
    color: #fff;
    text-transform: none;
    transition: none;
  }
  .referred-btn:hover {
    color: rgb(40, 67, 190);
  }
  .sb-text {
    font-weight: bold;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityDashboardComponent implements OnInit, OnDestroy {
  show = 5;
  page = 0;
  throttle = 10;
  scrollDistance = 0.3;
  isToday = false; // for showing and hiding filter option
  isOther = false; // for showing and hiding filter option
  caseOptions: OwlOptions = {
    dots: false,
    nav: true,
    navText: ['<i class=\'ti-angle-left\'></i>', '<i class=\'ti-angle-right\'></i>'],
    margin: 15,
    items: 2,
    responsive: {
      0: {
        items: 1
      },
      574: {
        items: 2
      },
      767: {
        items: 2
      },
      993: {
        items: 2
      }
    }
  };
  fullDate = new Date();
  today$: Observable<Dashboard[]>;
  other$: Observable<Dashboard[]>;
  forceReload$ = new Subject<void>();
  forceReloadToday$ = new Subject<void>();
  data = {
    languageID: '1',
    facilityuserID: '',
    facilityID: '',
    patientName: '',
    referbydoctorName: '',
    refercaseStatus: '',
    insuranceNames: '',
    patientGender: '',
    refercaseUrgent: '',
    reasonIDs: '',
    refercaseVisitTime: '',
    startDate: '',
    endDate: ''
  };
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private store: Store  ) {
  }
  ngOnDestroy(): void {
    this.facilityService.destroyOther(); // destroying on-going subscription
    this.facilityService.destroyToday(); // destroying on-going subscription
  }
  ngOnInit(): void {
    // initialization
    this.data.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    this.data.facilityuserID = this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID :
      this.service.getFaSession().facilityuserID;
    // today
    const initialValueToday$ = this.getDataOnceToday() as Observable<Dashboard[]>;
    const updatesToday$ = this.forceReloadToday$.pipe(mergeMap(() => this.getDataOnceToday() as Observable<Dashboard[]>));
    this.today$ = merge(initialValueToday$, updatesToday$);
    this.cd.markForCheck();
    // other
    const initialValue$ = this.getDataOnce() as Observable<Dashboard[]>;
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce() as Observable<Dashboard[]>));
    this.other$ = merge(initialValue$, updates$);
    this.cd.markForCheck();
    // notification
    this.facilityService.checkRequestPermission();
    this.facilityService.listeningToMessage();
  }
  getDataOnceToday = () => {
    return this.facilityService.today(JSON.stringify(this.data))
      .pipe(tap((res) => res[0].today.length > 0 ? this.isToday = true : this.isToday = false),
        map(res => res[0].today), take(1),
        catchError(() => of([]))) as Observable<Dashboard[]>;
  }
  getDataOnce = () => {
    return this.facilityService.other(JSON.stringify(this.data))
      .pipe(tap((res) => res[0].other.length > 0 ? this.isOther = true : this.isOther = false),
        map(res => res[0].other), take(1),
        catchError(() => of([]))) as Observable<Dashboard[]>;
  }
  onAppliedFilter = (filter: string) => {
    this.page = 0;
    this.data.patientName = JSON.parse(filter).patientName ? JSON.parse(filter).patientName.trim() : '';
    this.data.patientGender = JSON.parse(filter).patientGender ? JSON.parse(filter).patientGender.trim() : '';
    this.data.referbydoctorName = JSON.parse(filter).doctorName ? JSON.parse(filter).doctorName.trim() : '';
    this.data.refercaseUrgent = JSON.parse(filter).refercaseUrgent ? 'Yes' : '';
    this.data.insuranceNames = JSON.parse(filter).insuranceNames ? JSON.parse(filter).insuranceNames.trim() : '';
    this.data.startDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.data.endDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.today$ = this.filterToday(JSON.stringify(this.data)) as Observable<Dashboard[]>;
    this.other$ = this.filterOther(JSON.stringify(this.data)) as Observable<Dashboard[]>;
    this.cd.markForCheck();
  }
  onResetFilter = () => {
    this.page = 0;
    this.data.patientName = '';
    this.data.patientGender = '';
    this.data.referbydoctorName = '';
    this.data.refercaseUrgent = '';
    this.data.insuranceNames = '';
    this.data.startDate = '';
    this.data.endDate = '';
    this.today$ = this.filterToday(JSON.stringify(this.data)) as Observable<Dashboard[]>;
    this.other$ = this.filterOther(JSON.stringify(this.data)) as Observable<Dashboard[]>;
    this.cd.markForCheck();
  }
  filterToday = (data: string) => {
    return this.facilityService.facDashboardToday(data).pipe(tap(() => {
    }), map(res => res[0].today),
      catchError(() => of([]))) as Observable<Dashboard[]>;
  }
  filterOther = (data: string) => {
    return this.facilityService.facDashboardOther(data).pipe(tap(() => {
    }), map(res => res[0].other),
      catchError(() => of([]))) as Observable<Dashboard[]>;
  }
  forceReload = () => {
    this.facilityService.forceReloadOther();
    this.forceReload$.next();
  }
  forceReloadToday = () => {
    this.facilityService.forceReloadToday();
    this.forceReloadToday$.next();
  }
  onScrollEnd = () => {
    this.show += 5;
    this.cd.markForCheck();
  }
  navigateToMySchedule = () => {
    this.router.navigate(['/facility/facility-my-schedule']);
  }
  navigateToreferralReceived = () => {
    this.router.navigate(['/facility/facility-referral-received']);
  }
  showReferralClick = ($event: string) => {
    const data = { data: JSON.parse($event), from: 'dashboard' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/facility-dashboard/view-refer']);
  }
}
