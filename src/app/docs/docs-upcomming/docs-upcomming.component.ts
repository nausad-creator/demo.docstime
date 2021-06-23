import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, merge, of, Subscription } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { DocStore } from '../doc-store.service';
import { ReferralReceived } from '../docs.interface';
import { DocsService } from '../docs.service';
const currentDate = new Date();
@Component({
  selector: 'app-docs-upcomming',
  templateUrl: './docs-upcomming.component.html',
  styleUrls: ['./docs-upcomming.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsUpcommingComponent implements OnInit, OnDestroy {
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
    facilityID: '0',
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
    doctorID: '',
    page: this.pageSchedule.toString()
  };
  constructor(
    public docService: DocsService,
    public service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private store: DocStore,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // initialization
    this.upcomming.doctorID = this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID;
    this.upcomming.startDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialUpcomming$ = this.getDataOnceUpcomming() as Observable<ReferralReceived[]>;
    const updatesUpcomming$ = this.forceReloadUpcomming$.pipe(mergeMap(() => this.getDataOnceUpcomming() as Observable<ReferralReceived[]>));
    this.scheduledUpcomming$ = merge(initialUpcomming$, updatesUpcomming$);
    this.subscriptionInitial = this.scheduledUpcomming$.subscribe(res => {
      if (res) {
        this.scheduledAll = res;
        this.cd.markForCheck();
      }
      if (!res) {
        this.scheduledAll = [];
        this.cd.markForCheck();
      }
    }, (err) => {
      console.error(err);
    });
    this.docService.update.subscribe(filter => {
      if (filter) {
        this.onAppliedFilter(filter);
      }
    });
    this.docService.reset.subscribe(reset => {
      if (reset) {
        this.onResetFilter();
      }
    });
    this.docService.sortData.subscribe(sort => {
      if (sort) {
        this.onAppliedSorting(sort);
      }
    });
  }
  getDataOnceUpcomming = () => {
    return this.docService.referralReceivedUpcomming(JSON.stringify(this.upcomming)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.docService.showUpcommingFiler(c[0].recordcount > 0 ? true : false);
      }),
      map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  forceReloadUpcomming = () => {
    this.pageSchedule = 0;
    this.upcomming.page = this.pageSchedule.toString();
    this.docService.forceReloadUpcomming();
    this.forceReloadUpcomming$.next();
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
    }, (err) => {
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
    }, (err) => {
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
    }, (err) => {
      this.spinner.hide();
      console.error(err);
    });
  }
  filter = (data: string) => {
    return this.docService.referralReceivedLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  moreScheduledList = (data: string) => {
    return this.docService.referralReceivedLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  showReferralClick = ($event: string) => {
    const data = { data: JSON.parse($event), url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/doctor/doc-my-schedule-view-refer']);
  }
  ngOnDestroy(): void {
    this.docService.destroyUpcomming(); // destroying on-going subscription
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

