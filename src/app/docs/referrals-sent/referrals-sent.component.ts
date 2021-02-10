import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';
import { DocsService } from '../docs.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocStore } from '../doc-store.service';

@Component({
  selector: 'app-referrals-sent',
  templateUrl: './referrals-sent.component.html',
  styleUrls: ['./referrals-sent.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralsSentComponent implements OnInit {
  referralSent$: Observable<Array<any>>;
  throttle = 10;
  scrollDistance = 0.3;
  page = 0;
  all = [];
  data = {
    facilityID: '',
    refercaseStatus: '',
    languageID: '1',
    doctorID: '',
    page: this.page.toString()
  };
  constructor(
    public docService: DocsService,
    public service: HomeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService,
    private store: DocStore
  ) { }

  async ngOnInit(): Promise<void> {
    // initialization
    this.data.doctorID = this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID;
    // getting data
    this.referralSent$ = await this.getDataOnce() as Observable<any[]>;
    this.referralSent$.subscribe(res => res ? this.all = res : this.all = [], err => console.error(err));
    this.cd.markForCheck();
  }
  getDataOnce = () => {
    return new Promise(resolve => {
      resolve(this.docService.referralSent(JSON.stringify(this.data)).pipe(take(1)));
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
      this.docService.referralSentLists(data).subscribe(res => {
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
    this.router.navigate(['/doctor/referrals-sent/view-refer']);
  }
}
