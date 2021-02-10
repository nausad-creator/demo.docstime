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
  selector: 'app-previous',
  templateUrl: './previous.component.html',
  styleUrls: ['./previous.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviousComponent implements OnInit {
  scheduledPrevious$: Observable<Array<any>>;
  forceReloadPrivious$ = new Subject<void>();
  previousAll = [];
  throttle = 10;
  scrollDistance = 0.3;
  pagePrevious = 0;
  privious = {
    facilityID: '',
    refercaseStatus: 'Accepted',
    startDate: '',
    endDate: '',
    languageID: '1',
    doctorID: '0',
    page: this.pagePrevious.toString()
  };
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private store: Store) { }

  ngOnInit(): void {
    // initialization
    this.privious.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    this.privious.startDate = this.service.getFaLocal() ? moment(this.service.getFaLocal().facilityuserCreatedDate).format('YYYY-MM-DD')
      : moment(this.service.getFaSession().facilityuserCreatedDate).format('YYYY-MM-DD');
    this.privious.endDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialPrivious$ = this.getDataOncePrivious();
    const updatesPrivious$ = this.forceReloadPrivious$.pipe(mergeMap(() => this.getDataOncePrivious()));
    this.scheduledPrevious$ = merge(initialPrivious$, updatesPrivious$);
    this.scheduledPrevious$.subscribe(res => res ? this.previousAll = res : this.previousAll = [], err => console.error(err));
    this.cd.markForCheck();
  }
  getDataOncePrivious = () => {
    return this.facilityService.referralReceivedPrivious(JSON.stringify(this.privious)).pipe(take(1));
  }
  forceReloadPrivious = () => {
    this.facilityService.forceReloadPrivious();
    this.forceReloadPrivious$.next();
  }
  // for previous
  onScrollEndPrevious = () => {
    if (this.previousAll.length >= 20) {
      this.pagePrevious++;
      this.privious.page = this.pagePrevious.toString();
      this.morePreviousList(JSON.stringify(this.privious)).then((newVal: Array<any>) => {
        if (newVal.length > 0) {
          newVal.map((vl: any) => this.previousAll.push(vl));
          this.cd.markForCheck();
        }
      }).catch(err => console.error(err));
    }
  }
  morePreviousList = (data: string) => {
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
