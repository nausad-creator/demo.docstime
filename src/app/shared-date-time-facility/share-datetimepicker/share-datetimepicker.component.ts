import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, KeyValueDiffers, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { ReferralReceived } from 'src/app/facility/docs.interface';
import { FacilityService } from 'src/app/facility/facility.service';
import { HomeService } from 'src/app/home.service';

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
  scheduledAccepted$: Observable<ReferralReceived[]>;
  scheduled$: string[] = [];
  data = {
    facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
    patientName: '',
    referbydoctorName: '',
    insuranceNames: '',
    patientGender: '',
    refercaseUrgent: '',
    reasonIDs: '',
    refercaseVisitTime: '',
    refercaseStatus: '',
    startDate: '',
    endDate: '',
    languageID: '1',
    doctorID: '0',
    page: '0'
  };
  constructor(
    private service: HomeService,
    private facilityService: FacilityService,
    private cd: ChangeDetectorRef,
    private differs: KeyValueDiffers
  ) {
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
        minDate: new Date(),
        inline: true,
        scrollMonth: false,
        scrollInput: false,
        highlightedDates: this.scheduled$,
        onChangeDateTime: this.detectChange,
        onChangeMonth: this.changeMonth
      });
      const currentValue = ($('#datetimepicker2') as any).datetimepicker('getValue');
      this.getReferrals(currentValue);
      this.getReferralScheduled(currentValue);
    });
  }
  changeMonth = (dp: Date) => {
    this.getReferralScheduled(dp);
    this.cd.markForCheck();
  }
  detectChange = (dp: Date) => {
    this.getReferrals(dp);
    this.cd.markForCheck();
  }
  getReferralScheduled = (date: Date) => {
    this.data.refercaseStatus = 'Accepted';
    this.data.startDate = moment(new Date()).format('YYYY-MM-DD');
    this.data.endDate = moment(date).endOf('month').format('YYYY-MM-DD');
    this.facilityService.referralReceivedLists(JSON.stringify(this.data))
      .pipe(map(res => res[0].data), take(1), catchError(() => of([]))).subscribe((res: ReferralReceived[]) => {
        if (res) {
          this.scheduled$ = res.map((d: ReferralReceived) =>
            `${moment(new Date(d.refercaseVisitDate)).format('DD/MM/YYYY')},
            ${moment(d.refercaseVisitTime, 'h:mm:ss').format('LT')},
            ${'xdsoft_highlighted_mint'}`);
          ($('#datetimepicker2') as any).datetimepicker({
            lang: 'en',
            timepicker: false,
            format: 'd/m/Y',
            formatDate: 'd/m/Y',
            inline: true,
            scrollMonth: false,
            scrollInput: false,
            highlightedDates: this.scheduled$
          });
          this.cd.markForCheck();
        }
        if (!res) {
          this.scheduled$ = [];
          this.cd.markForCheck();
        }
      }, err => {
        throw new Error(err);
      });
  }
  getReferrals = (date: Date) => {
    this.data.refercaseStatus = '';
    this.data.startDate = moment(date).format('YYYY-MM-DD');
    this.data.endDate = moment(date).format('YYYY-MM-DD');
    this.scheduledAccepted$ = this.facilityService.referralReceivedLists(JSON.stringify(this.data))
      .pipe(map(res => res[0].data
        .filter(refer => refer.refercaseStatus === 'Pending' || refer.refercaseStatus === 'Accepted')),
         take(1), tap(() => this.cd.markForCheck()),
         catchError(() => of([]))) as Observable<ReferralReceived[]>;
  }
  ngDoCheck(): void {
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
