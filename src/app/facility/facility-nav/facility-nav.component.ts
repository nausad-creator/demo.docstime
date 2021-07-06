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
  template: `
  <!--::header Docs part start::-->
<header class="main_menu home_menu dashbord-header">
    <div class="container">
      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" routerLink="facility-dashboard">
          <img [defaultImage]="'assets/img/logo-white.png'" [lazyLoad]="'assets/img/logo-white.png'" [errorImage]="'assets/img/logo-white.png'" alt="logo" height="70"></a>
        <div class="mobile-users d-lg-none ml-auto">
          <ul class="navbar-nav">
            <li class="nav-item position-relative pr-3 align-self-center" routerLinkActive="active">
              <a class="nav-link" (click)="onClickBadge()" routerLink="facility-notifications" style="cursor: pointer;"><i
                  class="ti-bell"></i>
                <div [class.notify]="count > 0"><span [class.point]="count > 0" *ngIf="count > 0">{{count}}</span></div>
              </a></li>
            <li class="nav-item dropdown profiledropdown position-relative">
              <a class="nav-link dropdown-toggle title" id="navbarDropdownMenuLink3" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <!--<span class="usernames">Glen Johnson</span>-->
                <img [defaultImage]="'assets/img/user.png'" [lazyLoad]="url" [errorImage]="'assets/img/user.png'" class="img-user rounded-circle cursr" alt="My photo">
              </a>
              <div class="dropdown-menu scale-up-left position-absolute" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item cursr" routerLinkActive="active" routerLink="facility-doctors-list">Doctors</a>
                <a class="dropdown-item cursr" routerLinkActive="active" routerLink="facility-my-profile">My Profile</a>
                <a class="dropdown-item cursr" routerLinkActive="active" routerLink="facility-notification-settings">Notification Settings</a>
                <a class="dropdown-item cursr" routerLinkActive="active" routerLink="facility-change-password">Change Password</a>
                <a class="dropdown-item cursr" (click)="logOut()">Logout</a>
              </div>
            </li>
          </ul>
        </div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span> </button>
        <div class="collapse navbar-collapse main-menu-item justify-content-end" id="navbarSupportedContent">
          <ul class="navbar-nav align-items-center">
            <li class="nav-item" routerLinkActive="active"><a class="nav-link" routerLink="facility-dashboard">Home</a></li>
            <!--<li class="nav-item"><a class="nav-link" href="#">My Appoinments</a></li>-->
            <li class="nav-item" routerLinkActive="active"><a class="nav-link" routerLink="facility-my-schedule">My Schedule</a></li>
            <li class="nav-item" routerLinkActive="active"><a class="nav-link" routerLink="facility-referral-received">Referrals Received
              <span class="count"
              *ngIf="pendingCount > 0">{{pendingCount}}</span></a></li>
            <li class="nav-item" routerLinkActive="active"><a class="nav-link" routerLink="facility-referral-sent">Referrals Sent</a></li>
          </ul>
          <ul class="navbar-nav align-items-center ml-auto">
            <li class="nav-item" routerLinkActive="active"><a class="nav-link refer-button" routerLink="facility-add-refer-case" style="cursor: pointer;">Refer A Patient</a></li>
            <!-- <li class="nav-item d-none d-lg-block"><a class="nav-link p-0" style="font-size:18px;"><share-popup-button>Share</share-popup-button></a></li> -->
            <li>
              <share-popup-button
              [include]="['facebook','twitter','linkedin','pinterest','reddit','mix','vk','telegram','messenger','whatsapp','email','line']"
              [showIcon]="true"
              [theme]="'circles-dark'"
              [showText]="false"
              [size]="5"
              [icon]="faCoffee"
              [title]="'DocsRefer'"
              [description]="'Checkout this free new app for scheduling and sending/receiving referrals. I find it really useful for my practice and patients. Tap the link or QR code to see if this helps you as well. http://onelink.to/xm5yrw For more info go to www.docstime.com'"
              [url]="'https://www.docstime.com'"
              [image] ="'https://www.docstime.com/'"
              [autoSetMeta]="true"
              ></share-popup-button></li>
            <li class="nav-item d-none d-lg-block" routerLinkActive="active">
              <a class="nav-link" (click)="onClickBadge()" routerLink="facility-notifications" style="cursor: pointer;"><i class="ti-bell"></i>
                <div [class.notify]="count > 0"><span [class.point]="count > 0" *ngIf="count > 0">{{count}}</span></div>
              </a></li>
            <li class="nav-item dropdown profiledropdown d-none d-lg-block">
              <a class="nav-link dropdown-toggle title" id="navbarDropdownMenuLink3" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <span class="usernames" *ngIf="facData.facilityuserFullName">{{facData.facilityuserFullName | titlecase}}</span>
                <img [defaultImage]="'assets/img/user.png'" [lazyLoad]="url" [errorImage]="'assets/img/user.png'" class="img-user rounded-circle cursr" alt="My photo">
              </a>
              <div class="dropdown-menu scale-up-left" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item cursr" routerLinkActive="active" routerLink="facility-doctors-list">Doctors</a>
                <a class="dropdown-item cursr" routerLinkActive="active" routerLink="facility-my-profile">My Profile</a>
                <a class="dropdown-item cursr" routerLinkActive="active" routerLink="facility-notification-settings">Notification Settings</a>
                <a class="dropdown-item cursr" routerLinkActive="active" routerLink="facility-change-password">Change Password</a>
                <a >
                  <share-popup-button
                  [include]="['facebook','twitter','linkedin','pinterest','reddit','mix','vk','telegram','messenger','whatsapp','email','line']"
                  [showIcon]="false"
                  [showText]="true"
                  [size]="5"
                  [icon]="faCoffee"
                  [title]="'DocsRefer'"
                  [description]="'Checkout this free new app for scheduling and sending/receiving referrals. I find it really useful for my practice and patients. Tap the link or QR code to see if this helps you as well. http://onelink.to/xm5yrw For more info go to www.docstime.com'"
                  [url]="'https://www.docstime.com'"
                  [image] ="'https://www.docstime.com/'"
                  [autoSetMeta]="true"
                  ></share-popup-button></a>
                <a class="dropdown-item cursr" (click)="logOut()">Logout</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
  <ngx-spinner [fullScreen]="true" color="#fff" type="" bdColor="rgba(0, 0, 0, 0.9)">
    <div class="loader">
      <img class="logo-icon" [defaultImage]="'assets/img/favicon.png'" [lazyLoad]="'assets/img/favicon.png'" [errorImage]="'assets/img/favicon.png'" alt="DocsTime"><span>Loading...</span>
    </div>
  </ngx-spinner>
  `,
  styles: [`.cursr{
    cursor: pointer;
}`],
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
