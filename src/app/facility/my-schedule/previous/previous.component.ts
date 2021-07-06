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
  selector: 'app-previous',
  template: `<div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
  <div class="appointmen-content" *ngIf="previousAll.length>0">
    <div infinite-scroll [infiniteScrollDistance]="scrollDistance" [infiniteScrollThrottle]="throttle"
      [scrollWindow]="true" (scrolled)="onScrollEndPrevious()">
      <div class="details-list" *ngFor="let appoint of previousAll">
        <app-previous-appointment [patientFirstName]="appoint.patientFirstName ? appoint.patientFirstName : ''"
          [patientLastName]="appoint.patientLastName ? appoint.patientLastName : ''"
          [specialityName]="appoint.specialityName ? appoint.specialityName : ''"
          [doctorFullName]="appoint.doctorFullName ? appoint.doctorFullName : ''"
          [refercaseUrgent]="appoint.refercaseUrgent ? appoint.refercaseUrgent : ''"
          [doctorProfileImage]="appoint.doctorProfileImage ? appoint.doctorProfileImage : ''"
          [reasonName]="appoint.reasonName ? appoint.reasonName : appoint.reasonNames ? appoint.reasonNames : ''"
          [patientGender]="appoint.patientGender ? appoint.patientGender : ''" [age]="appoint.age ? appoint.age : '0'"
          [wholeObject]="appoint" [refSpecialityName]="appoint.insuranceNames ? appoint.insuranceNames : ''"
          [refercaseVisitDate]="appoint.refercaseVisitDate ? appoint.refercaseVisitDate : ''"
          [refercaseVisitTime]="appoint.refercaseVisitTime !== null && appoint.refercaseVisitTime !== Undefined && appoint.refercaseVisitTime !== '' ? appoint.refercaseVisitTime : ''"
          [refercaseStatus]="appoint.refercaseStatus ? appoint.refercaseStatus : ''" (view)="showReferralClick($event)">
        </app-previous-appointment>
      </div>
    </div>
    <div class="row" style="min-height: 250px;" *ngIf="previousAll.length > 0 && previousAll.length <= 3">
      <div class="">
        <div class="text-center">
          <p></p>
        </div>
      </div>
    </div>
    <div *ngIf="previousAll.length > 0 && previousAll.length <= 2">
      <div style="height: 350px;">
        <p></p>
      </div>
    </div>
  </div>
  <div class="" style="margin-top: 5px;" *ngIf="(scheduledPrevious$ | async) === null">
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
  <div class="" style="margin-top: 40px; height: 500px;" *ngIf="(scheduledPrevious$ | async) === undefined">
    <div class="row">
      <div class="col">
        <img class="img-center pt-3 pt-lg-5" src="assets/img/no-data.png" alt="No-Data">
        <p class="text-center" style="padding-right:32px;">No Record Found.</p>
      </div>
    </div>
  </div>
</div>`,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviousComponent implements OnInit, OnDestroy {
  scheduledPrevious$: Observable<ReferralReceived[]>;
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
    this.privious.startDate = this.service.getFaLocal() ? moment(this.service.getFaLocal().facilityuserCreatedDate).format('YYYY-MM-DD') : moment(this.service.getFaSession().facilityuserCreatedDate).format('YYYY-MM-DD');
    this.privious.endDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialPrivious$ = this.getDataOncePrivious() as Observable<ReferralReceived[]>;
    const updatesPrivious$ = this.forceReloadPrivious$.pipe(mergeMap(() => this.getDataOncePrivious() as Observable<ReferralReceived[]>));
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
    this.scheduledPrevious$ = this.filter(JSON.stringify(this.privious)) as Observable<ReferralReceived[]>;
    this.subscriptionFilter = this.scheduledPrevious$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.previousAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.previousAll = [];
        this.cd.markForCheck();
      }
    }, err => {
      this.spinner.hide();
      console.error(err);
    });
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
    this.scheduledPrevious$ = this.filter(JSON.stringify(this.privious)) as Observable<ReferralReceived[]>;
    this.subscriptionFilter = this.scheduledPrevious$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.previousAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.previousAll = [];
        this.cd.markForCheck();
      }
    }, err => {
      this.spinner.hide();
      console.error(err);
    });
  }
  onResetFilter = () => {
    this.pagePrevious = 0;
    this.privious.page = this.pagePrevious.toString();
    this.privious.patientName = '';
    this.privious.patientGender = '';
    this.privious.referbydoctorName = '';
    this.privious.refercaseUrgent = '';
    this.privious.insuranceNames = '';
    this.privious.startDate = this.service.getFaLocal() ? moment(this.service.getFaLocal().facilityuserCreatedDate).format('YYYY-MM-DD') : moment(this.service.getFaSession().facilityuserCreatedDate).format('YYYY-MM-DD');
    this.privious.endDate = moment(currentDate).format('YYYY-MM-DD');
    this.scheduledPrevious$ = this.filter(JSON.stringify(this.privious)) as Observable<ReferralReceived[]>;
    this.subscriptionReset = this.scheduledPrevious$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.previousAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.previousAll = [];
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
  getDataOncePrivious = () => {
    return this.facilityService.referralReceivedPrivious(JSON.stringify(this.privious)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.facilityService.showPreviousFiler(c[0].recordcount > 0 ? true : false);
      }),
      map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<ReferralReceived[]>;
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
          this.spinner.hide();
          this.previousAll.push(...res);
          this.cd.markForCheck();
        }, (err) => {
          this.spinner.hide();
          console.error(err);
        });
    }
  }
  morePreviousList = (post: string) => {
    return this.facilityService.referralReceivedLists(post).pipe(tap((count) => {
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
    this.facilityService.destroyPrivious(); // destroying on-going subscription
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
