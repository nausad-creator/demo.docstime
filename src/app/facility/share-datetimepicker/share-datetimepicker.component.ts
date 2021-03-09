import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, KeyValueDiffers, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { ReferralReceived } from '../docs.interface';
import { FacilityService } from '../facility.service';

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
  scheduledAccepted$: Observable<Array<any>>;
  constructor(
    private service: HomeService,
    private facilityService: FacilityService,
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

  public jQueryEvent = () => {
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
  public detectChange = (dp: Date) => {
    this.getReferralScheduled(dp);
    this.cd.markForCheck();
  }
  getReferralScheduled = (date: Date) => {
    const data = {
      facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
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
      doctorID: '0',
      page: '0'
    };
    this.scheduledAccepted$ = this.facilityService.referralReceivedLists(JSON.stringify(data))
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
