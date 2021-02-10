import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HomeService } from 'src/app/home.service';
import { ConfirmReceivedModalComponent } from '../confirm-received-modal/confirm-received-modal.component';
import { RejectReceivedModalComponent } from '../reject-received-modal/reject-received-modal.component';

@Component({
  selector: 'app-share-new-appointments',
  templateUrl: './share-new-appointments.component.html',
  styleUrls: ['./share-new-appointments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareNewAppointmentsComponent implements OnInit {
  @Input() patientFirstName: string;
  @Input() patientLastName: string;
  @Input() reasonName: string;
  @Input() patientGender: string;
  @Input() refDocName: string;
  @Input() age: string;
  @Input() refercaseUrgent: string;
  @Input() refSpecialityName: string;
  @Input() specialityName: string;
  @Input() refercaseVisitDate: string;
  @Input() refercaseVisitTime: string;
  @Input() refercaseStatus: string;
  @Input() refercaseID: string;
  @Input() facilityID: string;
  @Input() wholeOBject: any;
  @Output() view: EventEmitter<any> = new EventEmitter();
  @Output() updateView: EventEmitter<any> = new EventEmitter();
  @Output() updateViewToday: EventEmitter<any> = new EventEmitter();
  genderAtZero: string;
  fullName: string;
  convertedTime: string;
  preFixDRstr: string;
  bsModalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private service: HomeService
  ) { }

  ngOnInit(): void {
    this.refSpecialityName = this.refSpecialityName ? `/${this.refSpecialityName}` : '';
    this.genderAtZero = this.patientGender ? this.patientGender.charAt(0) : '';
    this.preFixDRstr = this.refDocName.substr(0, 3);
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
        const pDate = new Date(data.refercaseVisitDate).setHours(0, 0, 0, 0);
        const nDate = new Date().setHours(0, 0, 0, 0);
        if (pDate === nDate) {
          this.updateView.emit('Update');
          this.updateViewToday.emit('Update');
          this.service.refreshDateTime(this.refercaseID);
        } else {
          this.updateView.emit('Update');
          this.updateViewToday.emit('Update');
        }
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
        this.updateView.emit('Update');
      }
    });
  }

  onClickView = (referral: any) => {
    this.view.emit(JSON.stringify(referral));
  }
}
