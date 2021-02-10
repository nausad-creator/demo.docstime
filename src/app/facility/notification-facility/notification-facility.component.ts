import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';
import { Store } from '../store.service';

@Component({
  selector: 'app-notification-facility',
  templateUrl: './notification-facility.component.html',
  styleUrls: ['./notification-facility.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationFacilityComponent implements OnInit, DoCheck, OnDestroy {
  notificationLists$: Observable<Array<any>>;
  forceReload$ = new Subject<void>();
  throttle = 10;
  scrollDistance = 0.3;
  page = 0;
  notification = [];
  changes = '';
  differ: any;
  subscription: Subscription;
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
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const initialValue$ = this.getDataOnce();
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce()));
    this.notificationLists$ = merge(initialValue$, updates$);
    this.subscription = this.notificationLists$
      .subscribe(res => res ? this.notification = res : this.notification = [], err => console.error(err));
    this.cd.markForCheck();
    // behavior subscription
    this.service.updateNotificationOnPage.subscribe(res => this.changes = res);
  }
  getDataOnce = () => {
    this.page = 0;
    const data = {
      loginuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
      languageID: '1',
      page: this.page.toString()
    };
    return this.facilityService.notifyList(JSON.stringify(data)).pipe(take(1));
  }
  onUpdateList = () => {
    this.facilityService.forceReloadNotify();
    this.forceReload$.next();
  }
  onScrollEnd = () => {
    if (this.notification.length >= 10) {
      this.spinner.show();
      this.page++;
      const data = {
        loginuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
        languageID: '1',
        page: this.page.toString()
      };
      this.moreNotificationsList(JSON.stringify(data)).then((newVal: Array<any>) => {
        if (newVal.length > 0) {
          newVal.map((vl: any) => this.notification.push(vl));
          this.cd.markForCheck();
        }
      }).catch(err => console.error(err)).finally(() => this.spinner.hide());
    }
  }
  moreNotificationsList = (data: string) => {
    return new Promise((resolve, reject) => {
      this.facilityService.notificationLists(data).subscribe(res => {
        if (res) {
          resolve(res);
        } else {
          resolve([]);
        }
      }, err => reject(err));
    });
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
  onClickReferCase = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.facilityService.referralReceived(post).subscribe(res => resolve(res), err => reject(err));
    });
  }

}
