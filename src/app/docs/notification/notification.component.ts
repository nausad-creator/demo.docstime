import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { DocStore } from '../doc-store.service';
import { DocsService } from '../docs.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent implements OnInit, DoCheck {
  notificationLists$: Observable<Array<any>>;
  forceReload$ = new Subject<void>();
  throttle = 10;
  scrollDistance = 0.3;
  page = 0;
  notification = [];
  changes = '';
  differ: any;
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
    const initialValue$ = this.getDataOnce();
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce()));
    this.notificationLists$ = merge(initialValue$, updates$);
    this.notificationLists$.subscribe(res => res ? this.notification = res : this.notification = [], err => console.error(err));
    this.cd.markForCheck();
    // behavior subscription
    this.service.updateNotificationOnPage.subscribe(res => this.changes = res);
  }
  getDataOnce = () => {
    this.page = 0;
    const data = {
      loginuserID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID,
      languageID: '1',
      page: this.page.toString()
    };
    return this.docService.notifyList(JSON.stringify(data)).pipe(take(1));
  }
  onUpdateList = () => {
    this.docService.forceReloadNotify();
    this.forceReload$.next();
    this.cd.markForCheck();
  }
  onScrollEnd = () => {
    if (this.notification.length >= 10) {
      this.spinner.show();
      this.page++;
      const data = {
        loginuserID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID,
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
      this.docService.notificationLists(data).subscribe(res => {
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
        loginuserID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID,
        languageID: '1'
      };
      this.docService.resetBadgeNotify(JSON.stringify(data)).subscribe(res => resolve(res), err => reject(err));
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
    if (!referCase){
      this.toastr.error('No Data Found', 'Error');
    }
  }
  onClickReferCase = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.docService.referralReceived(post).subscribe(res => resolve(res), err => reject(err));
    });
  }
}
