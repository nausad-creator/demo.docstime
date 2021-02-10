import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject, merge } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';
import { Store } from '../store.service';
const currentDate = new Date();
@Component({
  selector: 'app-upcomming',
  templateUrl: './upcomming.component.html',
  styleUrls: ['./upcomming.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcommingComponent implements OnInit {
  scheduledUpcomming$: Observable<Array<any>>;
  forceReloadUpcomming$ = new Subject<void>();
  scheduledAll = [];
  throttle = 10;
  scrollDistance = 0.3;
  pageSchedule = 0;
  upcomming = {
    facilityID: '',
    refercaseStatus: 'Accepted',
    startDate: '',
    endDate: '',
    languageID: '1',
    doctorID: '0',
    page: this.pageSchedule.toString()
  };
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private store: Store  ) { }

  ngOnInit(): void {
    // initialization
    this.upcomming.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    this.upcomming.startDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialUpcomming$ = this.getDataOnceUpcomming();
    const updatesUpcomming$ = this.forceReloadUpcomming$.pipe(mergeMap(() => this.getDataOnceUpcomming()));
    this.scheduledUpcomming$ = merge(initialUpcomming$, updatesUpcomming$);
    this.scheduledUpcomming$.subscribe(res => res ? this.scheduledAll = res : this.scheduledAll = [], err => console.error(err));
    this.cd.markForCheck();
  }
  getDataOnceUpcomming = () => {
    return this.facilityService.referralReceivedUpcomming(JSON.stringify(this.upcomming)).pipe(take(1));
  }
  forceReloadUpcomming = () => {
    this.facilityService.forceReloadUpcomming();
    this.forceReloadUpcomming$.next();
  }
  // for more schedule
  onScrollEndScheduled = () => {
    if (this.scheduledAll.length >= 20) {
      this.pageSchedule++;
      this.upcomming.page = this.pageSchedule.toString();
      this.moreScheduledList(JSON.stringify(this.upcomming)).then((newVal: Array<any>) => {
        if (newVal.length > 0) {
          newVal.map((vl: any) => this.scheduledAll.push(vl));
          this.cd.markForCheck();
        }
      }).catch(err => console.error(err));
    }
  }
  moreScheduledList = (data: string) => {
    return new Promise((resolve, reject) => {
      this.facilityService.referralReceivedLists(data).subscribe(res => {
        if (res) {
          resolve(res);
        } else {
          resolve([]);
        }
      }, err => reject(err));
    });
  }
  showReferralClick = ($event: any) => {
    const data = { data: JSON.parse($event), url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/my-schedule-view-refer']);
  }
}
