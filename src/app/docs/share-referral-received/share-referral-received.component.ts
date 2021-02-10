import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmReceivedModalComponent } from '../confirm-received-modal/confirm-received-modal.component';
import { RejectReceivedModalComponent } from '../reject-received-modal/reject-received-modal.component';

@Component({
  selector: 'app-share-referral-received',
  templateUrl: './share-referral-received.component.html',
  styleUrls: ['./share-referral-received.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareReferralReceivedComponent implements OnInit {
  @Input() patientFirstName: string;
  @Input() patientLastName: string;
  @Input() reasonName: string;
  @Input() patientGender: string;
  @Input() refDocName: string;
  @Input() age: string;
  @Input() refercaseUrgent: string;
  @Input() refSpecialityName: string;
  @Input() refercaseVisitDate: string;
  @Input() refercaseVisitTime: string;
  @Input() refercaseStatus: string;
  @Input() refercaseID: string;
  @Input() facilityID: string;
  @Input() specialityName: string;
  @Input() wholeObject: any;
  @Output() view: EventEmitter<any> = new EventEmitter();
  @Output() updateView: EventEmitter<any> = new EventEmitter();
  genderAtZero: string;
  fullName: string;
  convertedTime: string;
  preFixDRstr: string;
  bsModalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.refSpecialityName = this.refSpecialityName ? `/${this.refSpecialityName}` : '';
    this.genderAtZero = this.patientGender ? this.patientGender.charAt(0) : '';
    this.fullName = this.patientFirstName && this.patientLastName ?
      `${this.patientFirstName} ${this.patientLastName}`
      : this.patientFirstName && !this.patientLastName ?
        this.patientFirstName : !this.patientFirstName && this.patientLastName ? this.patientLastName : '';
    this.preFixDRstr = this.refDocName.substr(0, 3);
    this.convertedTime = this.tConvert(this.refercaseVisitTime);
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

  openModalConfirm = () => {
    const initialState = {
      list: [{
        name: this.fullName,
        convertedTime: this.convertedTime,
        refercaseVisitTime: this.refercaseVisitTime ? this.refercaseVisitTime : '',
        genderAtZero: this.genderAtZero,
        refercaseVisitDate: this.refercaseVisitDate,
        age: this.age,
        reasonName: this.reasonName,
        refercaseID: this.refercaseID,
        refSpecialityName: this.refSpecialityName,
        facilityID: this.facilityID
      }]
    };
    this.bsModalRef = this.modalService.show(ConfirmReceivedModalComponent, { id: 201, initialState });
    this.bsModalRef.content.event.subscribe((res: any) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        this.updateView.emit();
      }
    });
  }
  openModalReject = () => {
    const initialState = {
      list: [{
        name: this.fullName,
        convertedTime: this.convertedTime,
        refercaseVisitTime: this.refercaseVisitTime ? this.refercaseVisitTime : '',
        genderAtZero: this.genderAtZero,
        refercaseVisitDate: this.refercaseVisitDate,
        age: this.age,
        reasonName: this.reasonName,
        refercaseID: this.refercaseID,
        refSpecialityName: this.refSpecialityName,
        facilityID: this.facilityID
      }]
    };
    this.bsModalRef = this.modalService.show(RejectReceivedModalComponent, { id: 912, initialState });
    this.bsModalRef.content.event.subscribe((res: any) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        this.updateView.emit();
      }
    });
  }
  onClickViewReferral = (referral: any) => {
    this.view.emit(JSON.stringify(referral));
  }
}
