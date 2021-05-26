import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HomeService } from 'src/app/home.service';
import { environment } from 'src/environments/environment';
import { ConfirmedReceivedModalComponent } from '../confirmed-received-modal/confirmed-received-modal.component';
import { ReferCase } from '../docs.interface';
import { RejectReceivedModalComponent } from '../reject-received-modal/reject-received-modal.component';
import { Store } from '../store.service';

@Component({
  selector: 'app-shared-new-appointment',
  templateUrl: './shared-new-appointment.component.html',
  styleUrls: ['./shared-new-appointment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedNewAppointmentComponent implements OnInit {
  @Input() patientFirstName: string;
  @Input() doctorFullName: string;
  @Input() doctorProfileImage: string;
  @Input() specialityName: string;
  @Input() patientLastName: string;
  @Input() reasonName: string;
  @Input() patientGender: string;
  @Input() age: string;
  @Input() refercaseUrgent: string;
  @Input() refSpecialityName: string;
  @Input() refercaseVisitDate: string;
  @Input() refercaseVisitTime: string;
  @Input() refercaseStatus: string;
  @Input() refercaseID: string;
  @Input() facilityID: string;
  @Input() doctorID: string;
  @Input() refercaseSentTZID: string;
  @Input() wholeOBject: ReferCase;
  @Output() view: EventEmitter<string> = new EventEmitter();
  @Output() updateView: EventEmitter<any> = new EventEmitter();
  @Output() updateViewToday: EventEmitter<any> = new EventEmitter();
  genderAtZero: string;
  fullName: string;
  convertedTime: string;
  bsModalRef: BsModalRef;
  preFixDRstr: string;
  baseUrl = `${environment.fileUrl}`;
  url: string;
  constructor(
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private service: HomeService,
    private router: Router,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.refSpecialityName = this.refSpecialityName ? `/${this.refSpecialityName}` : '';
    this.genderAtZero = this.patientGender ? this.patientGender.charAt(0) : '';
    this.preFixDRstr = this.doctorFullName.substr(0, 3);
    this.fullName = this.patientFirstName && this.patientLastName ?
      `${this.patientFirstName} ${this.patientLastName}`
      : this.patientFirstName && !this.patientLastName ?
        this.patientFirstName : !this.patientFirstName && this.patientLastName ? this.patientLastName : '';
    this.convertedTime = this.refercaseVisitTime !== null && this.refercaseVisitTime !== undefined && this.refercaseVisitTime ?
      this.tConvert(this.refercaseVisitTime) : '';
    this.url = `${this.baseUrl}/doctor/${this.doctorProfileImage}`;
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
        facilityID: this.facilityID,
        doctorID: this.doctorID
      }]
    };
    this.bsModalRef = this.modalService.show(ConfirmedReceivedModalComponent, { id: 200, initialState });
    this.bsModalRef.content.event.subscribe((res: any) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        const pDate = new Date(data.refercaseVisitDate).setHours(0, 0, 0, 0);
        const nDate = new Date().setHours(0, 0, 0, 0);
        if (pDate === nDate) {
          this.service.refreshDateTime(this.refercaseID);
          this.updateView.emit('Update');
          this.updateViewToday.emit('Update');
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
        refercaseID: this.refercaseID,
        facilityID: this.facilityID,
        tzID: this.refercaseSentTZID ? this.refercaseSentTZID : '',
        doctorID: this.doctorID,
        url: this.router.url
      }]
    };
    this.store.setRejectrefer(JSON.stringify(this.wholeOBject));
    this.bsModalRef = this.modalService.show(RejectReceivedModalComponent, { id: 911, initialState, class: 'modal-sm' });
    this.bsModalRef.content.event.subscribe((res: string) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        this.updateView.emit('Update');
      }
    });
  }
  mail = (email?: string) => {
    window.location.href = `mailto:${email}?subject=&body=`; // add the links to body
  }
  onClickView = (referral: ReferCase) => {
    this.view.emit(JSON.stringify(referral));
  }
}
