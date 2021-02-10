import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmReceivedModalComponent } from '../confirm-received-modal/confirm-received-modal.component';
import { DocsService } from '../docs.service';
import { RejectReceivedModalComponent } from '../reject-received-modal/reject-received-modal.component';
import { HomeService } from 'src/app/home.service';
import { Location } from '@angular/common';
import { DocStore } from '../doc-store.service';

@Component({
  selector: 'app-doctor-view-refer',
  templateUrl: './doctor-view-refer.component.html',
  styleUrls: ['./doctor-view-refer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorViewReferComponent implements OnInit {
  caseViewData: any;
  from: string;
  @Input() refercaseVisitDate: string;
  convertedTime: string;
  preFixDRstr: string;
  preFixDRstrSent: string;
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private service: HomeService,
    private docService: DocsService,
    private location: Location,
    private store: DocStore
  ) { }
  bsModalRef: BsModalRef;
  getViewData = () => {
    return new Promise(resolve => {
      resolve(JSON.parse(this.store.referView).data);
    });
  }
  async ngOnInit(): Promise<void> {
    this.caseViewData = await this.getViewData() as object;
    this.from = JSON.parse(this.store.referView).from;
    this.refercaseVisitDate = this.caseViewData.refercaseVisitDate;
    const time = this.caseViewData.refercaseVisitTime !== null && this.caseViewData.refercaseVisitTime !== 'Undefined' ?
      this.tConvert(this.caseViewData.refercaseVisitTime) : '';
    this.preFixDRstr = this.caseViewData.refDocName ? this.caseViewData.refDocName.substr(0, 3) : '';
    this.preFixDRstrSent = this.caseViewData.doctorFullName ? this.caseViewData.doctorFullName.substr(0, 3) : '';
    this.convertedTime = time ? ` - ${time}` : '';
    this.cd.markForCheck();
  }

  onClickBack = () => {
    this.location.back();
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
        doctorID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID
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
        doctorID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID
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
    const url = this.router.url.split('/');
    this.caseViewData.refercaseStatus = 'Accepted';
    if (`/${url[2]}` === '/dashboard') {
      this.docService.forceReloadOther();
      const data = { data: this.caseViewData, from: 'dashboard' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/referrals-received') {
      this.docService.forceReloadReceivedAll();
      const data = { data: this.caseViewData, from: 'received' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/referrals-sent') {
      const data = { data: this.caseViewData, from: 'insideSent' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/notifications') {
      const data = { data: this.caseViewData, from: 'notifications' };
      this.store.setReferView(JSON.stringify(data));
    }
    this.router.navigate([`/${url[1]}/${url[2]}`]);
  }
  checkWhereToNavigateRejected = () => {
    const url = this.router.url.split('/');
    this.caseViewData.refercaseStatus = 'Rejected';
    if (`/${url[2]}` === '/dashboard') {
      this.docService.forceReloadOther();
      const data = { data: this.caseViewData, from: 'dashboard' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/referrals-received') {
      this.docService.forceReloadReceivedAll();
      const data = { data: this.caseViewData, from: 'received' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/referrals-sent') {
      const data = { data: this.caseViewData, from: 'insideSent' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/notifications') {
      const data = { data: this.caseViewData, from: 'notifications' };
      this.store.setReferView(JSON.stringify(data));
    }
    this.router.navigate([`/${url[1]}/${url[2]}`]);
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
  openInNewWindow = (file: string) => {
    window.open(file);
  }
  onClickRereferDashboard = (data: any) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/doctor/dashboard/re-refer-case']);
  }
  onClickRereferSent = (data: any) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/doctor/referrals-sent/re-refer-case']);
  }
  onClickRereferReceived = (data: any) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/doctor/referrals-received/re-refer-case']);
  }
  onClickRereferNotification = (data: any) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/doctor/notifications/re-refer-case']);
  }
  onClickRereferAdd = (data: any) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/doctor/add-refer-case/re-refer-case']);
  }
}
