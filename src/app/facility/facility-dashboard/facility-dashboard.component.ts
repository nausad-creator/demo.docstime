import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, merge, of } from 'rxjs';
import { take, mergeMap, map, catchError, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { Dashboard } from '../docs.interface';
import { FacilityService } from '../facility.service';
import { Store } from '../store.service';

@Component({
  selector: 'app-facility-dashboard',
  templateUrl: './facility-dashboard.component.html',
  styleUrls: ['./facility-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityDashboardComponent implements OnInit {
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
  today$: Observable<Array<any>>;
  other$: Observable<Array<any>>;
  forceReload$ = new Subject<void>();
  forceReloadToday$ = new Subject<void>();
  data = {
    languageID: '1',
    facilityuserID: '',
    facilityID: '',
    patientName: '',
    referbydoctorName: '',
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
    private store: Store,
    private spinner: NgxSpinnerService
  ) {
  }
  ngOnInit(): void {
    // initialization
    this.data.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    this.data.facilityuserID = this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID :
      this.service.getFaSession().facilityuserID;
    // today
    const initialValueToday$ = this.getDataOnceToday() as Observable<Array<Dashboard>>;
    const updatesToday$ = this.forceReloadToday$.pipe(mergeMap(() => this.getDataOnceToday() as Observable<Array<Dashboard>>));
    this.today$ = merge(initialValueToday$, updatesToday$);
    this.cd.markForCheck();
    // other
    const initialValue$ = this.getDataOnce() as Observable<Array<Dashboard>>;
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce() as Observable<Array<Dashboard>>));
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
        catchError(() => of([]))) as Observable<Array<Dashboard>>;
  }
  getDataOnce = () => {
    return this.facilityService.other(JSON.stringify(this.data))
      .pipe(tap((res) => res[0].other.length > 0 ? this.isOther = true : this.isOther = false),
        map(res => res[0].other), take(1),
        catchError(() => of([]))) as Observable<Array<Dashboard>>;
  }
  onAppliedFilter = (filter: string) => {
    this.spinner.show();
    this.page = 0;
    this.data.patientName = JSON.parse(filter).patientName ? JSON.parse(filter).patientName.trim() : '';
    this.data.patientGender = JSON.parse(filter).patientGender ? JSON.parse(filter).patientGender.trim() : '';
    this.data.referbydoctorName = JSON.parse(filter).doctorName ? JSON.parse(filter).doctorName.trim() : '';
    this.data.refercaseUrgent = JSON.parse(filter).refercaseUrgent ? 'Yes' : '';
    this.data.insuranceNames = JSON.parse(filter).insuranceNames ? JSON.parse(filter).insuranceNames.trim() : '';
    this.data.startDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.data.endDate = JSON.parse(filter).referCaseDate ? moment(JSON.parse(filter).referCaseDate).format('YYYY-MM-DD') : '';
    this.today$ = this.filterToday(JSON.stringify(this.data)) as Observable<Array<Dashboard>>;
    this.other$ = this.filterOther(JSON.stringify(this.data)) as Observable<Array<Dashboard>>;
    this.cd.markForCheck();
  }
  onResetFilter = () => {
    this.spinner.show();
    this.page = 0;
    this.data.patientName = '';
    this.data.patientGender = '';
    this.data.referbydoctorName = '';
    this.data.refercaseUrgent = '';
    this.data.insuranceNames = '';
    this.data.startDate = '';
    this.data.endDate = '';
    this.today$ = this.filterToday(JSON.stringify(this.data)) as Observable<Array<Dashboard>>;
    this.other$ = this.filterOther(JSON.stringify(this.data)) as Observable<Array<Dashboard>>;
    this.cd.markForCheck();
  }
  filterToday = (data: string) => {
    return this.facilityService.facDashboardToday(data).pipe(tap(() => {
      this.spinner.hide();
    }), map(res => res[0].today),
      catchError(() => of([]))) as Observable<Array<Dashboard>>;
  }
  filterOther = (data: string) => {
    return this.facilityService.facDashboardOther(data).pipe(tap(() => {
      this.spinner.hide();
    }), map(res => res[0].other),
      catchError(() => of([]))) as Observable<Array<Dashboard>>;
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
  onScrollUp = () => {
    console.log('scrolled up!!');
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
