import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../../facility.service';
import { Store } from '../../store.service';
const currentDate = new Date();
@Component({
  selector: 'app-notification-facility',
  template: `<body class="dashbord-section">
  <div class="spacetop"></div>
  <section class="section-dashbord">
    <div class="container">
      <div class="">
        <div class="title-dashbord d-flex pt-3">
          <h4 class="text-dark mb-0">Notifications</h4>
          <div class="ml-auto">
            <div class="dropdown" *ngIf="isEmpty">
              <a class="dropdown-toggle cursr" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">Clear</a>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="right:0;left:auto;">
                <a class="dropdown-item cursr" (click)="clearOneWeek()">Last 1 week</a>
                <a class="dropdown-item cursr" (click)="clearAll()">Clear All</a>
              </div>
            </div>
          </div>
        </div>
        <br>
        <div class="section-purcels lefprolist" data-scroll-index="2">
          <div class="notificationlist" *ngIf="notification.length>0">
            <div infinite-scroll [infiniteScrollDistance]="scrollDistance" [infiniteScrollThrottle]="throttle"
              [scrollWindow]="true" (scrolled)="onScrollEnd()">
              <div *ngFor="let notify of notification">
                <app-shared-notification [notificationID]="notify.notificationID"
                  [notificationMessageText]="notify.notificationMessageText"
                  [notificationReadStatus]="notify.notificationReadStatus"
                  [notificationSendDate]="notify.notificationSendDate"
                  [notificationSendTime]="notify.notificationSendTime"
                  [notificationReferenceKey]="notify.notificationReferenceKey"
                  [notificationType]="notify.notificationType" (update)="onUpdateList()"
                  (navigate)="navigateToDetails($event)"></app-shared-notification>
              </div>
            </div>
          </div>
          <div class="row" style="min-height: 200px;"
            *ngIf="(notificationLists$ | async)?.length > 0 && (notificationLists$ | async)?.length <= 3">
            <div class="">
              <div class="text-center">
                <p></p>
              </div>
            </div>
          </div>
          <div *ngIf="(notificationLists$ | async)?.length > 0 && (notificationLists$ | async)?.length <= 2"
            style="height: 250px;">
            <div>
              <p></p>
            </div>
          </div>
          <div *ngIf="(notificationLists$ | async)?.length > 0 && (notificationLists$ | async)?.length <= 5"
            style="height: 150px;">
            <div>
              <p></p>
            </div>
          </div>
          <div *ngIf="(notificationLists$ | async)?.length > 0 && (notificationLists$ | async)?.length <= 7"
            style="height: 100px;">
            <div>
              <p></p>
            </div>
          </div>
          <div *ngIf="(notificationLists$ | async) === null">
            <div style="margin-top: 2px;">
              <ngx-skeleton-loader count="7" [theme]="{ height: '90px' }">
              </ngx-skeleton-loader>
            </div>
          </div>
          <div *ngIf="(notificationLists$ | async) === undefined">
            <div style="margin-top: 40px; height: 480px;">
              <div class="row">
                <div class="col">
                  <img class="img-center pt-3 pt-lg-5" src="assets/img/no-data.png" alt="No-Data">
                  <p class="text-center" style="padding-right:32px;">No Record Found.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
  <br>
</body>
`,
  styles: [`.cursr{
    cursor: pointer;
}
.backColor{
    background-color: rgb(216, 214, 214);
}`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationFacilityComponent implements OnInit, DoCheck, OnDestroy {
  notificationLists$: Observable<Array<Notification>>;
  forceReload$ = new Subject<void>();
  throttle = 10;
  scrollDistance = 0.3;
  page = 0;
  notification = [];
  changes = '';
  differ: any;
  recordCount: number;
  isEmpty = false;
  subscriptionInitial: Subscription;
  subscriptionUpdates: Subscription;
  data = {
    loginuserID: '',
    languageID: '1',
    page: this.page.toString()
  };
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private differs: KeyValueDiffers,
    private store: Store
  ) {
    // detect diff
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    // initialization
    this.data.loginuserID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    // getting data
    const initialValue$ = this.getDataOnce() as Observable<Array<Notification>>;
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce() as Observable<Array<Notification>>));
    this.notificationLists$ = merge(initialValue$, updates$);
    this.subscriptionInitial = this.notificationLists$
      .subscribe(res => res ? this.notification = res : this.notification = [], err => console.error(err));
    this.cd.markForCheck();
    // behavior subscription
    this.service.updateNotificationOnPage.subscribe(res => this.changes = res);
  }
  getDataOnce = () => {
    this.page = 0;
    this.data.page = this.page.toString();
    return this.facilityService.notifyList(JSON.stringify(this.data)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.isEmpty = c[0].recordcount > 0 ? true : false;
      }), map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<Array<Notification>>;
  }
  onUpdateList = () => {
    this.facilityService.forceReloadNotify();
    this.forceReload$.next();
  }
  onScrollEnd = () => {
    if (this.recordCount !== this.notification.length) {
      this.spinner.show();
      this.page++;
      this.data.page = this.page.toString();
      this.subscriptionUpdates = this.moreNotificationsList(JSON.stringify(this.data)).subscribe((res) => {
        res.map(v => this.notification.push(v));
        this.cd.markForCheck();
      },
        () => this.spinner.hide(),
        () => this.spinner.hide()
      );
    }
  }
  moreNotificationsList = (data: string) => {
    return this.facilityService.notificationLists(data).pipe(tap((count) => {
      this.recordCount = count[0].recordcount;
      this.spinner.hide();
    }), map(res => res[0].data),
      catchError(() => of([]))) as Observable<Array<Notification>>;
  }
  ngDoCheck(): any {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'changes') {
          this.onClickBadge();
        }
      });
    }
  }
  onClickBadge = () => {
    this.clearBadge().then((res: any) => {
      if (res[0].status === 'true') {
        this.onUpdateList();
      } else {
        console.error(res[0].message);
      }
    }).catch((err) => console.error(err));
  }
  clearBadge = () => {
    return new Promise((resolve, reject) => {
      const data = {
        loginuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID : this.service.getFaSession().facilityuserID,
        languageID: '1'
      };
      this.facilityService.resetBadgeNotify(JSON.stringify(data)).subscribe(res => resolve(res), err => reject(err));
    });
  }
  navigateToDetails = async (notificationReferenceKey: string) => {
    const data = {
      refercaseID: notificationReferenceKey,
      facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID
    };
    const referCase = await this.onClickReferCase(JSON.stringify(data));
    this.spinner.hide();
    if (referCase) {
      const temp = { data: referCase ? referCase[0] : '', from: 'notifications' };
      this.store.setReferView(JSON.stringify(temp));
      this.router.navigate(['/facility/facility-notifications/view-refer']);
    }
    if (!referCase) {
      this.toastr.error('No Data Found', 'Error');
    }
  }
  substractDays = (date: string | number | Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }
  clearOneWeek = () => {
    this.spinner.show();
    const data = {
      loginuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
      languageID: '1',
      notificationID: '',
      startDate: moment(this.substractDays(currentDate, 7)).format('YYYY-MM-DD'),
      endDate: moment(currentDate).format('YYYY-MM-DD'),
      deleteAll: '',
    };
    this.delete(JSON.stringify(data))
      .then(res => res[0].status === 'true' ? this.toastr.success('Deleted successfully') : this.toastr.error('Some error occured, please try again later'))
      .catch(() => this.toastr.error('Some error occured, please try again later'))
      .finally(() => { this.onUpdateList(); this.spinner.hide(); });
  }
  delete = (post: string) => {
    return new Promise((resolve, reject) => {
      this.facilityService.deleteNotification(post).subscribe((res) => resolve(res), error => reject(error));
    });
  }
  clearAll = () => {
    this.spinner.show();
    const data = {
      loginuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
      languageID: '1',
      notificationID: '',
      startDate: '',
      endDate: '',
      deleteAll: 'Yes',
    };
    this.delete(JSON.stringify(data))
      .then(res => res[0].status === 'true' ? this.toastr.success('Deleted successfully') : this.toastr.error('Some error occured, please try again later'))
      .catch(() => this.toastr.error('Some error occured, please try again later'))
      .finally(() => { this.onUpdateList(); this.spinner.hide(); });
  }
  onClickReferCase = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.facilityService.referralReceived(post).subscribe(res => resolve(res), err => reject(err));
    });
  }
  ngOnDestroy(): void {
    if (this.subscriptionUpdates) {
      this.subscriptionUpdates.unsubscribe();
    }
    if (this.subscriptionInitial) {
      this.subscriptionInitial.unsubscribe();
    }
  }
}
