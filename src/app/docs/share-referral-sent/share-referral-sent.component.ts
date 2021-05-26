import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ReferCase } from '../docs.interface';
import { TimelineComponent } from '../timeline/timeline.component';
interface TimeLine {
  doctorFax: string;
  doctorFullName: string;
  doctorID: string;
  doctorMobile: string;
  doctorProfileImage: string;
  facilityID: string;
  facilityLogo: string;
  facilityName: string;
  newTime: string;
  refercaseID: string;
  timelineDate: string;
  timelineID: string;
  timelineRemarks: string;
  timelineStatus: string;
  tzCountryCode: string;
  tzID: string;
}
@Component({
  selector: 'app-share-referral-sent',
  templateUrl: './share-referral-sent.component.html',
  styleUrls: ['./share-referral-sent.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareReferralSentComponent implements OnInit {
  @Input() patientFirstName: string;
  @Input() patientLastName: string;
  @Input() reasonName: string;
  @Input() patientGender: string;
  @Input() age: string;
  @Input() refercaseUrgent: string;
  @Input() refSpecialityName: string;
  @Input() refercaseVisitDate: string;
  @Input() refercaseVisitTime: string;
  @Input() refercaseStatus: string;
  @Input() specialityName: string;
  @Input() doctorFullName: string;
  @Input() timeline: Array<TimeLine>;
  @Input() wholeObject: ReferCase;
  @Output() view: EventEmitter<any> = new EventEmitter();
  genderAtZero: string;
  fullName: string;
  preFixDRstr: string;
  convertedTime: string;
  constructor(
    private cd: ChangeDetectorRef,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.refSpecialityName = this.refSpecialityName ? `/${this.refSpecialityName}` : '';
    this.preFixDRstr = this.doctorFullName ? this.doctorFullName.substr(0, 3) : '';
    this.genderAtZero = this.patientGender ? this.patientGender.charAt(0) : '';
    this.fullName = this.patientFirstName && this.patientLastName ?
      `${this.patientFirstName} ${this.patientLastName}`
      : this.patientFirstName && !this.patientLastName ?
        this.patientFirstName : !this.patientFirstName && this.patientLastName ? this.patientLastName : '';
    this.convertedTime = this.refercaseVisitTime !== null && this.refercaseVisitTime !== undefined && this.refercaseVisitTime ?
      this.tConvert(this.refercaseVisitTime) : '';
    this.cd.markForCheck();
  }
  tConvert = (time: any) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    time[0] < 10 ? (time[0] = '0' + time[0]) : (time[0] = time[0]);
    return time[0] + '' + time[1] + '' + time[2] + ' ' + time[5]; // return adjusted time or original string
  }
  openTimeLine = (timeLine: Array<TimeLine>) => {
    const initialState = {
      list: [{ timeline: timeLine }]
    };
    this.modalService.show(TimelineComponent, { initialState });
  }
  openMail = () => {
    window.open(`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=someone@example.com&su=SUBJECT&body=BODY&bcc=someone.else@example.com&tf=1`);
  }
  onClickViewReferral = (referral: ReferCase) => {
    this.view.emit(JSON.stringify(referral));
  }

}
