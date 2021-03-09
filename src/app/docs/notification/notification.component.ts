import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { DocStore } from '../doc-store.service';
import { Notification } from '../docs.interface';
import { DocsService } from '../docs.service';
const currentDate = new Date();
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent implements OnInit, DoCheck, OnDestroy {
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
  data = {
    loginuserID: '',
    languageID: '1',
    page: this.page.toString()
  };
  subscriptionInitial: Subscription;
  subscriptionUpdates: Subscription;
  constructor(
    private docService: DocsService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private differs: KeyValueDiffers,
    private store: DocStore
  ) {
    // detect diff
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    // initialization
    this.data.loginuserID = this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID;
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
    return this.docService.notifyList(JSON.stringify(this.data)).pipe(
      tap((c) => {
        this.recordCount = c[0].recordcount;
        this.isEmpty = c[0].recordcount > 0 ? true : false;
      }), map(res => res[0].data),
      take(1), catchError(() => of([]))) as Observable<Array<Notification>>;
  }
  onUpdateList = () => {
    this.docService.forceReloadNotify();
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
    return this.docService.notificationLists(data).pipe(tap((count) => {
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
      this.docService.resetBadgeNotify(JSON.stringify(this.data)).subscribe(res => resolve(res), err => reject(err));
    });
  }
  navigateToDetails = async (notificationReferenceKey: string) => {
    const data = {
      refercaseID: notificationReferenceKey,
      doctorID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID
    };
    const referCase = await this.onClickReferCase(JSON.stringify(data));
    this.spinner.hide();
    if (referCase) {
      const temp = { data: referCase ? referCase[0] : '', from: 'notifications' };
      this.store.setReferView(JSON.stringify(temp));
      this.router.navigate(['/doctor/notifications/view-refer']);
    }
    if (!referCase) {
      this.toastr.error('No Data Found', 'Error');
    }
  }
  onClickReferCase = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.docService.referralReceived(post).subscribe(res => resolve(res), err => reject(err));
    });
  }
  substractDays = (date: string | number | Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }
  clearOneWeek = () => {
    this.spinner.show();
    const data = {
      loginuserID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID,
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
      this.docService.deleteNotification(post).subscribe((res) => resolve(res), error => reject(error));
    });
  }
  clearAll = () => {
    this.spinner.show();
    const data = {
      loginuserID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID,
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
  ngOnDestroy(): void {
    if (this.subscriptionUpdates) {
      this.subscriptionUpdates.unsubscribe();
    }
    if (this.subscriptionInitial) {
      this.subscriptionInitial.unsubscribe();
    }
  }
}
