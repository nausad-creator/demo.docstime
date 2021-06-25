import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject, Subscription, merge } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { DocsService } from '../docs.service';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { ReceivedCount } from '../docs.interface';
const currentDate = new Date();
@Component({
  selector: 'app-doc-nav',
  templateUrl: './doc-nav.component.html',
  styleUrls: ['./doc-nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocNavComponent implements OnInit, DoCheck, OnDestroy {
  scheduledAll$: Observable<Array<ReceivedCount>>;
  forceReload$ = new Subject<void>();
  count = 0;
  pendingCount = 0;
  differ: any;
  page = 0;
  detectChange = '';
  detectChangeNofication = '';
  faCoffee = faShareAlt;
  qr = 'src/assets/img/qrCode.jpeg';
  subscription: Subscription;
  docData = {
    doctorID: '',
    doctorFullName: '',
    doctorProfileImage: ''
  };
  baseUrl = `${environment.fileUrl}`;
  url: string;
  routeUrl: string;
  constructor(
    private differs: KeyValueDiffers,
    private service: HomeService,
    private router: Router,
    private docService: DocsService,
    private cd: ChangeDetectorRef
  ) {
    // detect diff
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    const initialValue$ = this.getDataOnce() as Observable<Array<ReceivedCount>>;
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce() as Observable<Array<ReceivedCount>>));
    this.scheduledAll$ = merge(initialValue$, updates$);
    this.subscription = this.scheduledAll$.subscribe((res: Array<ReceivedCount>) => {
      if (res[0].status !== 'false') {
        res[0].data.length > 0 ? this.count = +res[0].data[0].doctorbadgeCount : this.count = 0;
        res[0].count.length > 0 ? this.pendingCount = res[0].count[0].pendingCount : this.pendingCount = 0;
        this.cd.markForCheck();
      }
    }, err => console.error(err));
    // this is for behavior subject
    this.service.update.subscribe((res) => this.detectChange = res);
    this.service.updateNotiAndReferralCount.subscribe((res) => this.detectChangeNofication = res);
    this.checkStatus();
    this.routeUrl = this.router.url;
    this.cd.markForCheck();
  }
  getDataOnce = () => {
    const data = {
      facilityID: '',
      refercaseStatus: '',
      startDate: moment(currentDate).format('YYYY-MM-DD'),
      endDate: '',
      languageID: '1',
      doctorID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID,
      page: this.page.toString()
    };
    return this.docService.referralReceivedCount(JSON.stringify(data));
  }
  forceReload = () => {
    this.docService.forceReloadCount();
    this.forceReload$.next();
  }

  ngDoCheck(): any {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'detectChange') {
          this.checkStatus();
        }
        if (item.key === 'detectChangeNofication') {
          this.forceReload();
        }
        if (item.key === 'count') {
          let val = Math.random();
          this.service.refreshNotificationWhileOnPage(`${val++}`);
        }
      });
    }
  }
  checkStatus = () => {
    const currentUser = this.service.getDocLocal() ? this.service.getDocLocal() : this.service.getDocSession();
    if (!this.isEmpty(currentUser || !this.isBlank(currentUser))) {
      this.docData.doctorFullName = currentUser.doctorFullName;
      this.docData.doctorProfileImage = currentUser.doctorProfileImage;
      this.docData.doctorID = currentUser.doctorID;
      this.url = `${this.baseUrl}/doctor/${this.docData.doctorProfileImage}`;
    } else {
      Object.keys(this.docData).forEach((k) => { delete this.docData[k]; });
      this.url = '';
      this.router.navigate(['/']);
    }
  }
  isEmpty = (str: string | any[]) => {
    return (!str || 0 === str.length);
  }
  isBlank = (str: string | any) => {
    return (!str || /^\s*$/.test(str));
  }
  logOut = () => {
    this.service.getDocLocal() ? this.service.removeLocal() : this.service.removeSession();
    this.docService.unSubscribe();
    this.docService.unSubs();
    if (window.sessionStorage) {
      sessionStorage.clear();
    }
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }
  onClickBadge = () => {
    this.clearBadge().then((res: any) => {
      if (res[0].status === 'true') {
        this.forceReload();
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
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
