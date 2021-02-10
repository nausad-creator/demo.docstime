import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, merge } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';
import { Store } from '../store.service';

@Component({
  selector: 'app-cancelled',
  templateUrl: './cancelled.component.html',
  styleUrls: ['./cancelled.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelledComponent implements OnInit {
  cancelled$: Observable<Array<any>>;
  cancelledAll = [];
  throttle = 10;
  scrollDistance = 0.3;
  pageCancelled = 0;
  forceReloadCancel$ = new Subject<void>();
  cancelled = {
    facilityID: '',
    refercaseStatus: 'Rejected',
    startDate: '',
    endDate: '',
    languageID: '1',
    doctorID: '0',
    page: this.pageCancelled.toString()
  };
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // initialization
    this.cancelled.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    // getting data
    const initialCancel$ = this.getDataOnceCancel();
    const updatesCancel$ = this.forceReloadCancel$.pipe(mergeMap(() => this.getDataOnceCancel()));
    this.cancelled$ = merge(initialCancel$, updatesCancel$);
    this.cancelled$.subscribe(res => res ? this.cancelledAll = res : this.cancelledAll = [], err => console.error(err));
    this.cd.markForCheck();
  }
  getDataOnceCancel = () => {
    return this.facilityService.referralCancelled(JSON.stringify(this.cancelled)).pipe(take(1));
  }
  forceReloadCancel = () => {
    this.facilityService.forceReloadCancel();
    this.forceReloadCancel$.next();
  }
  showReferralClick = ($event: any) => {
    const data = { data: JSON.parse($event), url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/my-schedule-view-refer']);
  }
  // for cancelled
  onScrollEndCancelled = () => {
    if (this.cancelledAll.length >= 20) {
      this.spinner.show();
      this.pageCancelled++;
      this.cancelled.page = this.pageCancelled.toString();
      this.moreCancelledList(JSON.stringify(this.cancelled)).then((newVal: Array<any>) => {
        if (newVal.length > 0) {
          newVal.map((vl: any) => this.cancelledAll.push(vl));
          this.cd.markForCheck();
        }
      }).catch(err => console.error(err)).finally(() => this.spinner.hide());
    }
  }
  moreCancelledList = (data: string) => {
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
}
