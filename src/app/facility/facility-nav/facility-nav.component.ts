import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, KeyValueDiffers, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject, Subscription, merge } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { ReceivedCount } from '../docs.interface';
const currentDate = new Date();
@Component({
  selector: 'app-facility-nav',
  templateUrl: './facility-nav.component.html',
  styleUrls: ['./facility-nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityNavComponent implements OnInit, DoCheck, OnDestroy {
  scheduledAll$: Observable<ReceivedCount[]>;
  forceReloadFacility$ = new Subject<void>();
  count = 0;
  pendingCount = 0;
  differ: any;
  page = 0;
  detectChange = '';
  faCoffee = faShareAlt;
  qr = 'src/assets/img/qrCode.jpeg';
  detectChangeNofication = '';
  facData = {
    facilityuserFullName: '',
    facilityuserProfileImage: ''
  };
  subscription: Subscription;
  baseUrl = `${environment.fileUrl}`;
  url: string;
  @Output() loggedOutFacility: EventEmitter<any> = new EventEmitter();
  constructor(
    private differs: KeyValueDiffers,
    private service: HomeService,
    private router: Router,
    private facilityService: FacilityService,
    private cd: ChangeDetectorRef
  ) {
    // detect diff
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    const initialValue$ = this.getDataOnce() as Observable<ReceivedCount[]>;
    const updates$ = this.forceReloadFacility$.pipe(mergeMap(() => this.getDataOnce() as Observable<ReceivedCount[]>));
    this.scheduledAll$ = merge(initialValue$, updates$);
    this.subscription = this.scheduledAll$.subscribe((res: ReceivedCount[]) => {
      if (res[0].status !== 'false') {
        res[0].data.length > 0 ? this.count = +res[0].data[0].facilityBadgeCount : this.count = 0;
        res[0].count.length > 0 ? this.pendingCount = +res[0].count[0].pendingCount : this.pendingCount = 0;
        this.cd.markForCheck();
      }
    }, err => console.error(err));
    // this is for behavior subject
    this.service.update.subscribe((res) => this.detectChange = res);
    this.service.updateNotiAndReferralCount.subscribe((res) => this.detectChangeNofication = res);
    this.checkStatus();
    this.cd.markForCheck();
  }
  getDataOnce = () => {
    const data = {
      facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
      refercaseStatus: '',
      startDate: moment(currentDate).format('YYYY-MM-DD'),
      endDate: '',
      languageID: '1',
      doctorID: '0',
      page: this.page.toString()
    };
    return this.facilityService.referralReceivedCount(JSON.stringify(data));
  }
  forceReload = () => {
    this.facilityService.forceReloadCount();
    this.forceReloadFacility$.next();
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
    const currentUser = this.service.getFaLocal() ? this.service.getFaLocal() : this.service.getFaSession();
    if (!this.isEmpty(currentUser || !this.isBlank(currentUser))) {
      this.facData.facilityuserFullName = currentUser.facilityuserFirstName && currentUser.facilityuserLastName ? `${currentUser.facilityuserFirstName} ${currentUser.facilityuserLastName}` : currentUser.facilityuserFirstName && !currentUser.facilityuserLastName ? `${currentUser.facilityuserFirstName}` : !currentUser.facilityuserFirstName && currentUser.facilityuserLastName ? `${currentUser.facilityuserLastName}` : 'Unknown';
      this.facData.facilityuserProfileImage = currentUser.facilityuserImage;
      this.url = `${this.baseUrl}/facilityuser/${this.facData.facilityuserProfileImage}`;
    } else {
      Object.keys(this.facData).forEach((k) => { delete this.facData[k]; });
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
    this.service.getFaLocal() ? this.service.removeFaLocal() : this.service.removeFaSession();
    this.facilityService.unSubscribe();
    this.facilityService.unSubs();
    this.service.unSubscribe();
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
        loginuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID : this.service.getFaSession().facilityuserID,
        languageID: '1'
      };
      this.facilityService.resetBadgeNotify(JSON.stringify(data)).subscribe(res => resolve(res), err => reject(err));
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
