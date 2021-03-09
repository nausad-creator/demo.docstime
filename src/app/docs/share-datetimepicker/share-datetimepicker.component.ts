import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, KeyValueDiffers, OnInit, Output } from '@angular/core';
import { HomeService } from 'src/app/home.service';
import * as moment from 'moment';
import { DocsService } from '../docs.service';
import { Observable } from 'rxjs';
import { ReferralReceived } from '../docs.interface';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-share-datetimepicker',
  templateUrl: './share-datetimepicker.component.html',
  styleUrls: ['./share-datetimepicker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareDatetimepickerComponent implements OnInit, DoCheck {
  differ: any;
  changes = '';
  @Input() from: string;
  @Output() updateView: EventEmitter<any> = new EventEmitter();
  scheduledAccepted$: Observable<Array<ReferralReceived>>;
  constructor(
    private service: HomeService,
    private docService: DocsService,
    private cd: ChangeDetectorRef,
    private differs: KeyValueDiffers
  ) {
    // detect diff
    this.differ = this.differs.find({}).create();
  }
  ngOnInit(): void {
    this.jQueryEvent();
    this.service.updateDateTimeSchedule.subscribe(res => this.changes = res);
  }
  updateReferView = () => {
    this.updateView.emit();
  }

  jQueryEvent = () => {
    jQuery(() => {
      ($('#datetimepicker2') as any).datetimepicker({
        lang: 'en',
        timepicker: false,
        format: 'd/m/Y',
        formatDate: 'd/m/Y',
        inline: true,
        scrollMonth: false,
        scrollInput: false,
        onChangeDateTime: this.detectChange
      });
      const currentValue = ($('#datetimepicker2') as any).datetimepicker('getValue');
      this.getReferralScheduled(currentValue);
    });
  }
  detectChange = (dp: Date) => {
    this.getReferralScheduled(dp);
    this.cd.markForCheck();
  }

  getReferralScheduled = (date: Date) => {
    const data = {
      page: '0',
      facilityID: '0',
      patientName: '',
      referbydoctorName: '',
      insuranceNames: '',
      patientGender: '',
      refercaseUrgent: '',
      reasonIDs: '',
      refercaseVisitTime: '',
      refercaseStatus: 'Accepted',
      startDate: moment(date).format('YYYY-MM-DD'),
      endDate: moment(date).format('YYYY-MM-DD'),
      languageID: '1',
      doctorID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID
    };
    this.scheduledAccepted$ = this.docService.referralReceivedLists(JSON.stringify(data))
      .pipe(map(res => res[0].data)) as Observable<Array<ReferralReceived>>;
    this.cd.markForCheck();
  }
  ngDoCheck(): any {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'changes') {
          const currentValue = ($('#datetimepicker2') as any).datetimepicker('getValue');
          this.getReferralScheduled(currentValue);
        }
      });
    }
  }
}
