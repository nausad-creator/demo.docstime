import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmedReceivedModalComponent } from '../confirmed-received-modal/confirmed-received-modal.component';
import { RejectReceivedModalComponent } from '../reject-received-modal/reject-received-modal.component';
import { Location } from '@angular/common';
import { Store } from '../store.service';
import { ReferCase } from '../docs.interface';
@Component({
  selector: 'app-my-scheduled-view-refer',
  templateUrl: './my-scheduled-view-refer.component.html',
  styleUrls: ['./my-scheduled-view-refer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyScheduledViewReferComponent implements OnInit {
  caseViewData: ReferCase;
  url: string;
  @Input() refercaseVisitDate: string;
  convertedTime: string;
  preFixDRstr: string;
  preFixDRstrSent: string;
  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private location: Location,
    private store: Store
  ) { }
  bsModalRef: BsModalRef;
  getViewData = () => {
    return new Promise(resolve => {
      resolve(JSON.parse(this.store.referView).data);
    });
  }
  async ngOnInit(): Promise<void> {
    this.caseViewData = await this.getViewData() as ReferCase;
    this.url = JSON.parse(this.store.referView).url;
    this.refercaseVisitDate = this.caseViewData.refercaseVisitDate;
    const time = this.caseViewData.refercaseVisitTime !== null && this.caseViewData.refercaseVisitTime !== 'Undefined' ?
      this.tConvert(this.caseViewData.refercaseVisitTime) : '';
    this.convertedTime = time ? ` - ${time}` : '';
    this.preFixDRstr = this.caseViewData.refDocName ? this.caseViewData.refDocName.substr(0, 3) : '';
    this.preFixDRstrSent = this.caseViewData.doctorFullName ? this.caseViewData.doctorFullName.substr(0, 3) : '';
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
    this.bsModalRef = this.modalService.show(ConfirmedReceivedModalComponent, { id: 200, initialState });
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
    this.bsModalRef = this.modalService.show(RejectReceivedModalComponent, { id: 911, initialState, class: 'modal-sm' });
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
    this.router.navigate([`${this.url ? this.url : '/facility/facility-my-schedule'}`]);
  }
  checkWhereToNavigateRejected = () => {
    this.caseViewData.refercaseStatus = 'Rejected';
    const data = { data: this.caseViewData, url: this.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`${this.url ? this.url : '/facility/facility-my-schedule'}`]);
  }
  // openInNewWindow = (file: string) => {
  //   window.open(file);
  // }
  onClickRereferSchedule = (data: any) => {
    data.url = this.url;
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/my-schedule-re-refer-case']);
  }
  openImage = (src: string) => {
    ($ as any).magnificPopup.open({
      items: {
        src: `${src}`,
      },
      type: 'image'
    });
  }
  mail = (email?: string) => {
    window.location.href = `mailto:${email}?subject=&body=`; // add the links to body
  }
  phone = (phone?: string) => {
    window.location.href = `tel:${phone}`; // add the links to body
  }
}
