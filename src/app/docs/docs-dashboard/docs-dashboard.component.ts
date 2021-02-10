import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { merge, Observable, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { DocStore } from '../doc-store.service';
import { DocsService } from '../docs.service';

@Component({
  selector: 'app-docs-dashboard',
  templateUrl: './docs-dashboard.component.html',
  styleUrls: ['./docs-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsDashboardComponent implements OnInit {
  fullDate = new Date();
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
  today$: Observable<Array<any>>;
  other$: Observable<Array<any>>;
  forceReload$ = new Subject<void>();
  forceReloadToday$ = new Subject<void>();
  data = {
    languageID: '1',
    logindoctorID: ''
  };
  constructor(
    public docService: DocsService,
    public service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private store: DocStore
  ) {}
  ngOnInit(): void {
    // initialization
    this.data.logindoctorID = this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID;
    // today
    const initialValueToday$ = this.getDataOnceToday();
    const updatesToday$ = this.forceReloadToday$.pipe(mergeMap(() => this.getDataOnceToday()));
    this.today$ = merge(initialValueToday$, updatesToday$);
    this.cd.markForCheck();
    // others
    const initialValue$ = this.getDataOnce();
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce()));
    this.other$ = merge(initialValue$, updates$);
    this.cd.markForCheck();
    // notification
    this.docService.checkRequestPermission();
    this.docService.listeningToMessage();
  }
  getDataOnceToday = () => {
    return this.docService.today(JSON.stringify(this.data)).pipe(take(1));
  }
  getDataOnce = () => {
    return this.docService.other(JSON.stringify(this.data)).pipe(take(1));
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
}
