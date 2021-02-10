import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, Subject, merge } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
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
  throttle = 10;
  scrollDistance = 0.3;
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
    facilityID: ''
  };
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private store: Store
  ) {
  }
  ngOnInit(): void {
    // initialization
    this.data.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    this.data.facilityuserID = this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID :
      this.service.getFaSession().facilityuserID;
    // today
    const initialValueToday$ = this.getDataOnceToday();
    const updatesToday$ = this.forceReloadToday$.pipe(mergeMap(() => this.getDataOnceToday()));
    this.today$ = merge(initialValueToday$, updatesToday$);
    this.cd.markForCheck();
    // other
    const initialValue$ = this.getDataOnce();
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce()));
    this.other$ = merge(initialValue$, updates$);
    this.cd.markForCheck();
    // notification
    this.facilityService.checkRequestPermission();
    this.facilityService.listeningToMessage();
  }
  getDataOnce = () => {
    return this.facilityService.other(JSON.stringify(this.data)).pipe(take(1));
  }
  getDataOnceToday = () => {
    return this.facilityService.today(JSON.stringify(this.data)).pipe(take(1));
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
  showReferralClick = ($event: any) => {
    const data = { data: JSON.parse($event), from: 'dashboard' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/facility-dashboard/view-refer']);
  }
}
