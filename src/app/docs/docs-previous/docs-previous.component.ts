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
  selector: 'app-docs-previous',
  templateUrl: './docs-previous.component.html',
  styleUrls: ['./docs-previous.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsPreviousComponent implements OnInit, OnDestroy {
  scheduledPrevious$: Observable<Array<ReferralReceived>>;
  forceReloadPrivious$ = new Subject<void>();
  throttle = 10;
  scrollDistance = 0.3;
  pagePrevious = 0;
  recordCount: number;
  previousAll = [];
  subscriptionInitial: Subscription;
  subscriptionUpdates: Subscription;
  subscriptionFilter: Subscription;
  subscriptionReset: Subscription;
  privious = {
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
    page: this.pagePrevious.toString()
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
    this.privious.doctorID = this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID;
    this.privious.startDate = this.service.getDocLocal() ? moment(this.service.getDocLocal().doctorCreatedDate).format('YYYY-MM-DD')
      : moment(this.service.getDocSession().doctorCreatedDate).format('YYYY-MM-DD');
    this.privious.endDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialPrivious$ = this.getDataOncePrivious() as Observable<Array<ReferralReceived>>;
    const updatesPrivious$ = this.forceReloadPrivious$.pipe(
      mergeMap(() => this.getDataOncePrivious() as Observable<Array<ReferralReceived>>));
    this.scheduledPrevious$ = merge(initialPrivious$, updatesPrivious$);
    this.subscriptionInitial = this.scheduledPrevious$.subscribe
      (res => res ? this.previousAll = res : this.previousAll = [], err => console.error(err));
    this.cd.markForCheck();
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
  onAppliedFilter = (filter: string) => {
    this.spinner.show();
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
    });
  }
  onAppliedSorting = (sorting: string) => {
    this.spinner.show();
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
    });
  }
  onResetFilter = () => {
    this.spinner.show();
    this.pagePrevious = 0;
    this.privious.page = this.pagePrevious.toString();
    this.privious.patientName = '';
    this.privious.patientGender = '';
    this.privious.referbydoctorName = '';
    this.privious.refercaseUrgent = '';
    this.privious.insuranceNames = '';
    this.privious.startDate = this.service.getDocLocal() ? moment(this.service.getDocLocal().doctorCreatedDate).format('YYYY-MM-DD')
      : moment(this.service.getDocSession().doctorCreatedDate).format('YYYY-MM-DD');
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
    });
    this.cd.markForCheck();
  }
  filter = (data: string) => {
    return this.docService.referralReceivedLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
      this.spinner.hide();
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<Array<ReferralReceived>>;
  }
  getDataOncePrivious = () => {
    return this.docService.referralReceivedPrivious(JSON.stringify(this.privious)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.docService.showPreviousFiler(c[0].recordcount > 0 ? true : false);
      }),
      map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<Array<ReferralReceived>>;
  }
  forceReloadPrivious = () => {
    this.pagePrevious = 0;
    this.privious.page = this.pagePrevious.toString();
    this.docService.forceReloadPrivious();
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
    return this.docService.referralReceivedLists(post).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
      this.spinner.hide();
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<Array<ReferralReceived>>;
  }
  showReferralClick = ($event: string) => {
    const data = { data: JSON.parse($event), url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/doctor/doc-my-schedule-view-refer']);
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
