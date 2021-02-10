import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject, merge } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { DocStore } from '../doc-store.service';
import { DocsService } from '../docs.service';
const currentDate = new Date();
@Component({
  selector: 'app-docs-previous',
  templateUrl: './docs-previous.component.html',
  styleUrls: ['./docs-previous.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsPreviousComponent implements OnInit {
  scheduledPrevious$: Observable<Array<any>>;
  forceReloadPrivious$ = new Subject<void>();
  throttle = 10;
  scrollDistance = 0.3;
  pagePrevious = 0;
  previousAll = [];
  privious = {
    facilityID: '0',
    refercaseStatus: 'Accepted',
    startDate: '',
    endDate: '',
    languageID: '1',
    doctorID: '',
    page: this.pagePrevious.toString()
  };
  constructor(
    public docService: DocsService,
    public service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private store: DocStore  ) { }
  ngOnInit(): void {
    // initialization
    this.privious.doctorID = this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID;
    this.privious.startDate = this.service.getDocLocal() ? moment(this.service.getDocLocal().doctorCreatedDate).format('YYYY-MM-DD')
    : moment(this.service.getDocSession().doctorCreatedDate).format('YYYY-MM-DD');
    this.privious.endDate = moment(currentDate).format('YYYY-MM-DD');
    // getting data
    const initialPrivious$ = this.getDataOncePrivious();
    const updatesPrivious$ = this.forceReloadPrivious$.pipe(mergeMap(() => this.getDataOncePrivious()));
    this.scheduledPrevious$ = merge(initialPrivious$, updatesPrivious$);
    this.scheduledPrevious$.subscribe(res => res ? this.previousAll = res : this.previousAll = [], err => console.error(err));
    this.cd.markForCheck();
  }
  getDataOncePrivious = () => {
    return this.docService.referralReceivedPrivious(JSON.stringify(this.privious)).pipe(take(1));
  }
  forceReloadPrivious = () => {
    this.docService.forceReloadPrivious();
    this.forceReloadPrivious$.next();
  }
  showReferralClick = ($event: any) => {
    const data = { data: JSON.parse($event), url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/doctor/doc-my-schedule-view-refer']);
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
  morePreviousList = (post: string) => {
    return new Promise((resolve, reject) => {
      this.docService.referralReceivedLists(post).subscribe(res => {
        if (res) {
          resolve(res);
        } else {
          resolve([]);
        }
      }, err => reject(err));
    });
  }
}
