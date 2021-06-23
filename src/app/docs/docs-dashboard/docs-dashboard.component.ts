import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { DocStore } from '../doc-store.service';
import { Dashboard } from '../docs.interface';
import { DocsService } from '../docs.service';

@Component({
  selector: 'app-docs-dashboard',
  templateUrl: './docs-dashboard.component.html',
  styleUrls: ['./docs-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsDashboardComponent implements OnInit, OnDestroy {
  fullDate = new Date();
  page = 0;
  show = 5;
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
  today$: Observable<Dashboard[]>;
  other$: Observable<Dashboard[]>;
  forceReload$ = new Subject<void>();
  forceReloadToday$ = new Subject<void>();
  data = {
    languageID: '1',
    logindoctorID: '',
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
    public docService: DocsService,
    public service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private store: DocStore  ) { }
  ngOnDestroy(): void {
    this.docService.destroyOther(); // destroying on-going subscription
    this.docService.destroyToday(); // destroying on-going subscription
  }
  ngOnInit(): void {
    // initialization
    this.data.logindoctorID = this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID;
    // today
    const initialValueToday$ = this.getDataOnceToday() as Observable<Dashboard[]>;
    const updatesToday$ = this.forceReloadToday$.pipe(mergeMap(() => this.getDataOnceToday() as Observable<Dashboard[]>));
    this.today$ = merge(initialValueToday$, updatesToday$);
    this.cd.markForCheck();
    // others
    const initialValue$ = this.getDataOnce() as Observable<Dashboard[]>;
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce() as Observable<Dashboard[]>));
    this.other$ = merge(initialValue$, updates$);
    this.cd.markForCheck();
    // notification
    this.docService.checkRequestPermission();
    this.docService.listeningToMessage();
  }
  getDataOnceToday = () => {
    return this.docService.today(JSON.stringify(this.data))
      .pipe(tap((res) => res[0].today.length > 0 ? this.isToday = true : this.isToday = false),
        map(res => res[0].today), take(1),
        catchError(() => of([]))) as Observable<Dashboard[]>;
  }
  getDataOnce = () => {
    return this.docService.other(JSON.stringify(this.data))
      .pipe(tap((res) => res[0].other.length > 0 ? this.isOther = true : this.isOther = false),
        map(res => res[0].other), take(1),
        catchError(() => of([]))) as Observable<Dashboard[]>;
  }
  onScrollEnd = () => {
    this.show += 10;
    this.cd.markForCheck();
  }
  forceReload = () => {
    this.docService.forceReloadOther();
    this.forceReload$.next();
  }
  forceReloadToday = () => {
    this.docService.forceReloadToday();
    this.forceReloadToday$.next();
  }
  navigateToMySchedule = () => {
    this.router.navigate(['/doctor/my-schedule']);
  }
  navigateToreferralReceived = () => {
    this.router.navigate(['/doctor/referrals-received']);
  }
  showReferralClick = ($event: string) => {
    const data = { data: JSON.parse($event), from: 'dashboard' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/doctor/dashboard/view-refer']);
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
    return this.docService.docDashboardToday(data).pipe(tap(() => {
    }), map(res => res[0].today),
      catchError(() => of([]))) as Observable<Dashboard[]>;
  }
  filterOther = (data: string) => {
    return this.docService.docDashboardOther(data).pipe(tap(() => {
    }), map(res => res[0].other),
      catchError(() => of([]))) as Observable<Dashboard[]>;
  }
}
