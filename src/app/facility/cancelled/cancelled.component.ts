import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, merge, of, Subscription } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { ReferralReceived } from '../docs.interface';
import { FacilityService } from '../facility.service';
import { Store } from '../store.service';
const currentDate = new Date();
@Component({
  selector: 'app-cancelled',
  templateUrl: './cancelled.component.html',
  styleUrls: ['./cancelled.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelledComponent implements OnInit, OnDestroy {
  cancelled$: Observable<ReferralReceived[]>;
  cancelledAll = [];
  throttle = 10;
  scrollDistance = 0.3;
  pageCancelled = 0;
  recordCount: number;
  forceReloadCancel$ = new Subject<void>();
  cancelled = {
    facilityID: '',
    refercaseStatus: 'Rejected',
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
    page: this.pageCancelled.toString()
  };
  subscriptionInitial: Subscription;
  subscriptionUpdates: Subscription;
  subscriptionFilter: Subscription;
  subscriptionReset: Subscription;
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService,
    private store: Store
  ) { }

  ngOnInit(): void {
    // initialization
    this.cancelled.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    // getting data
    const initialCancel$ = this.getDataOnceCancel() as Observable<ReferralReceived[]>;
    const updatesCancel$ = this.forceReloadCancel$.pipe(mergeMap(() => this.getDataOnceCancel() as Observable<ReferralReceived[]>));
    this.cancelled$ = merge(initialCancel$, updatesCancel$);
    this.subscriptionInitial = this.cancelled$.subscribe((res) => {
      if (res) {
        this.cancelledAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.cancelledAll = [];
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
    this.pageCancelled = 0;
    this.cancelled.page = this.pageCancelled.toString();
    this.cancelled.patientName = JSON.parse(filter).patientName ? JSON.parse(filter).patientName.trim() : '';
    this.cancelled.patientGender = JSON.parse(filter).patientGender ? JSON.parse(filter).patientGender.trim() : '';
    this.cancelled.referbydoctorName = JSON.parse(filter).doctorName ? JSON.parse(filter).doctorName.trim() : '';
    this.cancelled.refercaseUrgent = JSON.parse(filter).refercaseUrgent ? 'Yes' : '';
    this.cancelled.insuranceNames = JSON.parse(filter).insuranceNames ? JSON.parse(filter).insuranceNames.trim() : '';
    this.cancelled.startDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.cancelled.endDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.cancelled$ = this.filter(JSON.stringify(this.cancelled)) as Observable<ReferralReceived[]>;
    this.subscriptionFilter = this.cancelled$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.cancelledAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.cancelledAll = [];
        this.cd.markForCheck();
      }
    }, err => {
      this.spinner.hide();
      console.error(err);
    });
  }
  onAppliedSorting = (sorting: string) => {
    this.pageCancelled = 0;
    this.cancelled.page = this.pageCancelled.toString();
    this.cancelled.patientName = '';
    this.cancelled.patientGender = '';
    this.cancelled.referbydoctorName = '';
    this.cancelled.refercaseUrgent = '';
    this.cancelled.insuranceNames = '';
    this.cancelled.startDate = JSON.parse(sorting).startDate ? JSON.parse(sorting).startDate : '';
    this.cancelled.endDate = JSON.parse(sorting).endDate ? JSON.parse(sorting).endDate : '';
    this.cancelled$ = this.filter(JSON.stringify(this.cancelled)) as Observable<ReferralReceived[]>;
    this.subscriptionFilter = this.cancelled$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.cancelledAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.cancelledAll = [];
        this.cd.markForCheck();
      }
    }, err => {
      this.spinner.hide();
      console.error(err);
    });
  }
  onResetFilter = () => {
    this.pageCancelled = 0;
    this.cancelled.page = this.pageCancelled.toString();
    this.cancelled.patientName = '';
    this.cancelled.patientGender = '';
    this.cancelled.referbydoctorName = '';
    this.cancelled.refercaseUrgent = '';
    this.cancelled.insuranceNames = '';
    this.cancelled.startDate = this.service.getFaLocal() ? moment(this.service.getFaLocal().facilityuserCreatedDate).format('YYYY-MM-DD') : moment(this.service.getFaSession().facilityuserCreatedDate).format('YYYY-MM-DD');
    this.cancelled.endDate = moment(currentDate).format('YYYY-MM-DD');
    this.cancelled$ = this.filter(JSON.stringify(this.cancelled)) as Observable<ReferralReceived[]>;
    this.subscriptionReset = this.cancelled$.subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.cancelledAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.spinner.hide();
        this.cancelledAll = [];
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
  getDataOnceCancel = () => {
    return this.facilityService.referralCancelled(JSON.stringify(this.cancelled)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.facilityService.showCancelledFiler(c[0].recordcount > 0 ? true : false);
      }),
      map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  forceReloadCancel = () => {
    this.pageCancelled = 0;
    this.cancelled.page = this.pageCancelled.toString();
    this.facilityService.forceReloadCancel();
    this.forceReloadCancel$.next();
  }
  showReferralClick = ($event: string) => {
    const data = { data: JSON.parse($event), url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/my-schedule-view-refer']);
  }
  // for cancelled
  onScrollEndCancelled = () => {
    if (this.cancelledAll.length >= 20) {
      this.spinner.show();
      this.pageCancelled++;
      this.cancelled.page = this.pageCancelled.toString();
      this.subscriptionUpdates = this.moreCancelledList(JSON.stringify(this.cancelled))
        .subscribe((res) => {
          this.spinner.hide();
          this.cancelledAll.push(...res);
          this.cd.markForCheck();
        }, (err) => {
          this.spinner.hide();
          console.error(err);
        });
    }
  }
  moreCancelledList = (data: string) => {
    return this.facilityService.referralReceivedLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  ngOnDestroy(): void {
    this.facilityService.destroyCancelled(); // destroying on-going subscription
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
