import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmReceivedModalComponent } from '../confirm-received-modal/confirm-received-modal.component';
import { DocStore } from '../doc-store.service';
import { Location } from '@angular/common';
import { RejectReceivedModalComponent } from '../reject-received-modal/reject-received-modal.component';
@Component({
  selector: 'app-docs-view-my-schedule',
  templateUrl: './docs-view-my-schedule.component.html',
  styleUrls: ['./docs-view-my-schedule.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsViewMyScheduleComponent implements OnInit {
  caseViewData: any;
  url: string;
  @Input() refercaseVisitDate: string;
  convertedTime: string;
  preFixDRstr: string;
constructor(
  public toastr: ToastrService,
  private cd: ChangeDetectorRef,
  private router: Router,
  private modalService: BsModalService,
  private store: DocStore,
  private location: Location
) { }
bsModalRef: BsModalRef;
getViewData = () => {
  return new Promise(resolve => {
    resolve(JSON.parse(this.store.referView).data);
  });
}
  async ngOnInit(): Promise<void> {
  this.caseViewData = await this.getViewData() as object;
  this.url = JSON.parse(this.store.referView).url;
  this.refercaseVisitDate = this.caseViewData.refercaseVisitDate;
  const time = this.caseViewData.refercaseVisitTime !== null && this.caseViewData.refercaseVisitTime !== 'Undefined' ?
      this.tConvert(this.caseViewData.refercaseVisitTime) : '';
  this.preFixDRstr = this.caseViewData.refDocName.substr(0, 3);
  this.convertedTime = time ? ` - ${time}` : '';
  this.cd.markForCheck();
}

onClickBack = () => {
  this.location.back();
}
tConvert = (time: any) => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  time[0] < 10 ? (time[0] = '0' + time[0]) : (time[0] = time[0]);
  return time[0] + '' + time[1] + '' + time[2] + ' ' + time[5];
}
updateView = () => {
  this.ngOnInit();
  this.cd.markForCheck();
}
openModalConfirm = (post: any) => {
  const initialState = {
    list: [{
      name: post.patientFirstName ? post.patientFirstName : 'Undefined',
      convertedTime: post.refercaseVisitTime ? this.tConvert(post.refercaseVisitTime) : 'Undefined',
      refercaseVisitTime: post.refercaseVisitTime ? post.refercaseVisitTime : '',
      genderAtZero: post.patientGender.charAt(0),
      refercaseVisitDate: post.refercaseVisitDate ? post.refercaseVisitDate : '',
      age: post.age ? post.age : '0',
      reasonName: post.reasonName ? post.reasonName : post.reasonNames,
      refercaseID: post.refercaseID,
      refSpecialityName: post.insuranceNames ? `/${post.insuranceNames}` : '',
      facilityID: post.facilityID,
      doctorID: post.doctorID
    }]
  };
  this.bsModalRef = this.modalService.show(ConfirmReceivedModalComponent, { id: 200, initialState });
  this.bsModalRef.content.event.subscribe((res: any) => {
    const data = JSON.parse(res);
    if (data.res === 'confirmed') {
      setTimeout(() => {
        this.checkWhereToNavigateAccepted();
      }, 500);
    }
  });
}
openModalReject = (post: any) => {
  const initialState = {
    list: [{
      name: post.patientFirstName ? post.patientFirstName : 'Undefined',
      convertedTime: post.refercaseVisitTime ? this.tConvert(post.refercaseVisitTime) : 'Undefined',
      refercaseVisitTime: post.refercaseVisitTime ? post.refercaseVisitTime : '',
      genderAtZero: post.patientGender.charAt(0),
      refercaseVisitDate: post.refercaseVisitDate ? post.refercaseVisitDate : '',
      age: post.age ? post.age : '0',
      reasonName: post.reasonName ? post.reasonName : post.reasonNames,
      refercaseID: post.refercaseID,
      refSpecialityName: post.insuranceNames ? `/${post.insuranceNames}` : '',
      facilityID: post.facilityID,
      doctorID: post.doctorID
    }]
  };
  this.bsModalRef = this.modalService.show(RejectReceivedModalComponent, { id: 911, initialState });
  this.bsModalRef.content.event.subscribe((res: any) => {
    const data = JSON.parse(res);
    if (data.res === 'confirmed') {
      setTimeout(() => {
        this.checkWhereToNavigateRejected();
      }, 500);
    }
  });
}
checkWhereToNavigateAccepted = () => {
  this.caseViewData.refercaseStatus = 'Accepted';
  const data = { data: this.caseViewData, url: this.url };
  this.store.setReferView(JSON.stringify(data));
  this.router.navigate([`${this.url}`]);
}
checkWhereToNavigateRejected = () => {
  this.caseViewData.refercaseStatus = 'Rejected';
  const data = { data: this.caseViewData, url: this.url };
  this.store.setReferView(JSON.stringify(data));
  this.router.navigate([`${this.url}`]);
}
openInNewWindow = (file: string) => {
  window.open(file);
}
onClickRereferSchedule = (data: any) => {
  data.url = this.url;
  this.store.setRerefer(JSON.stringify(data));
  this.router.navigate(['/doctor/doc-my-schedule-re-refer-case']);
}
}
