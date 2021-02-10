import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';
import { Store } from '../store.service';
@Component({
  selector: 'app-facility-referral-sent',
  templateUrl: './facility-referral-sent.component.html',
  styleUrls: ['./facility-referral-sent.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityReferralSentComponent implements OnInit {
  referralSent$: Observable<Array<any>>;
  throttle = 10;
  scrollDistance = 0.3;
  page = 0;
  all = [];
  data = {
    facilityID: '',
    refercaseStatus: '',
    languageID: '1',
    doctorID: '0',
    page: this.page.toString()
  };
  constructor(
    private service: HomeService,
    private facilityService: FacilityService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService,
    private store: Store
  ) {}

  async ngOnInit(): Promise<void> {
    // initialization
    this.data.facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
    // getting data
    this.referralSent$ = await this.getDataOnce() as Observable<any[]>;
    this.referralSent$.subscribe(res => res ? this.all = res : this.all = [], err => console.error(err));
    this.cd.markForCheck();
  }
  getDataOnce = () => {
    return new Promise(resolve => {
      resolve(this.facilityService.referralSent(JSON.stringify(this.data)).pipe(take(1)));
    });
  }
  onScrollEnd = () => {
    if (this.all.length >= 10) {
      this.spinner.show();
      this.page++;
      this.data.page = this.page.toString();
      this.moreSentList(JSON.stringify(this.data)).then((newVal: Array<any>) => {
        if (newVal.length > 0) {
          newVal.map((vl: any) => this.all.push(vl));
          this.cd.markForCheck();
        }
      }).catch(err => console.error(err)).finally(() => this.spinner.hide());
    }
  }
  moreSentList = (data: string) => {
    return new Promise((resolve, reject) => {
      this.facilityService.referralSentLists(data).subscribe(res => {
        if (res) {
          resolve(res);
        } else {
          resolve([]);
        }
      }, err => reject(err));
    });
  }
  showReferralClick = ($event: any) => {
    const data = { data: JSON.parse($event), from: 'sent' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/facility-referral-sent/view-refer']);
  }
}
