import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { merge, Observable, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { DocStore } from '../doc-store.service';
import { DocsService } from '../docs.service';
const currentDate = new Date();
@Component({
  selector: 'app-referrals-received',
  templateUrl: './referrals-received.component.html',
  styleUrls: ['./referrals-received.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralsReceivedComponent implements OnInit {
  scheduledAll$: Observable<Array<any>>;
  forceReload$ = new Subject<void>();
  throttle = 10;
  scrollDistance = 0.3;
  page = 0;
  all = [];
  data = {
    facilityID: '',
    refercaseStatus: '',
    startDate: '',
    endDate: '',
    languageID: '1',
    doctorID: '',
    page: this.page.toString()
  };
  constructor(
    public docService: DocsService,
    public service: HomeService,
    public router: Router,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private store: DocStore
  ) { }

  ngOnInit(): void {
    // initialization
    this.data.doctorID = this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID;
    this.data.startDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialValue$ = this.getDataOnce();
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce()));
    this.scheduledAll$ = merge(initialValue$, updates$);
    this.scheduledAll$.subscribe(res => res ? this.all = res : this.all = [] , err => console.error(err));
    this.cd.markForCheck();
  }
  getDataOnce = () => {
    return this.docService.referralReceivedAll(JSON.stringify(this.data)).pipe(take(1));
  }
  forceReload = () => {
    this.docService.forceReloadReceivedAll();
    this.forceReload$.next();
    this.cd.markForCheck();
  }
  onScrollEnd = () => {
    if (this.all.length >= 20) {
      this.spinner.show();
      this.page++;
      this.data.page = this.page.toString();
      this.moreReceivedList(JSON.stringify(this.data)).then((newVal: Array<any>) => {
        if (newVal.length > 0) {
          newVal.map((vl: any) => this.all.push(vl));
          this.cd.markForCheck();
        }
      }).catch(err => console.error(err)).finally(() => this.spinner.hide());
    }
  }
  moreReceivedList = (data: string) => {
    return new Promise((resolve, reject) => {
      this.docService.referralReceivedLists(data).subscribe(res => {
        if (res) {
          resolve(res);
        } else {
          resolve([]);
        }
      }, err => reject(err));
    });
  }
  showReferralClick = ($event: any) => {
    const data = { data: JSON.parse($event), from: 'received' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/doctor/referrals-received/view-refer']);
  }
}
