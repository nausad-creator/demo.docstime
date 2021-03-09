import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmedReceivedModalComponent } from '../confirmed-received-modal/confirmed-received-modal.component';
import { RejectReceivedModalComponent } from '../reject-received-modal/reject-received-modal.component';
import { Router } from '@angular/router';
import { FacilityService } from '../facility.service';
import { Location } from '@angular/common';
import { Store } from '../store.service';
import { ReferCase } from '../docs.interface';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-view-refer',
  templateUrl: './view-refer.component.html',
  styleUrls: ['./view-refer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewReferComponent implements OnInit {
  caseViewData: ReferCase;
  from: string;
  @Input() refercaseVisitDate: string;
  convertedTime: string;
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private facilityService: FacilityService,
    private location: Location,
    private store: Store
  ) { }
  bsModalRef: BsModalRef;
  preFixDRstr: string;
  preFixDRstrSent: string;
  getViewData = () => {
    return new Promise(resolve => {
      resolve(JSON.parse(this.store.referView).data);
    });
  }
  async ngOnInit(): Promise<void> {
    this.caseViewData = await this.getViewData() as ReferCase;
    this.from = JSON.parse(this.store.referView).from;
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
  updateView = () => {
    this.ngOnInit();
    this.cd.markForCheck();
  }

  openModalConfirm = (post: ReferCase) => {
    const initialState = {
      list: [{
        name: post.patientFirstName ? post.patientFirstName : 'Undefined',
        convertedTime: post.refercaseVisitTime ? this.tConvert(post.refercaseVisitTime) : 'Undefined',
        refercaseVisitTime: post.refercaseVisitTime ? post.refercaseVisitTime : '',
        genderAtZero: post.patientGender.charAt(0),
        refercaseVisitDate: post.refercaseOrgVisitDate,
        age: post.age ? post.age : '0',
        reasonName: post.reasonName ? post.reasonName : post.reasonNames,
        refercaseID: post.refercaseID,
        refSpecialityName: post.insuranceNames ? `/${post.insuranceNames}` : '',
        facilityID: post.facilityID,
        doctorID: post.doctorID
      }]
    };
    this.bsModalRef = this.modalService.show(ConfirmedReceivedModalComponent, { id: 200, initialState });
    this.bsModalRef.content.event.subscribe((res: string) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        setTimeout(() => {
          this.checkWhereToNavigateAccepted();
        }, 500);
      }
    });
  }
  openModalReject = (post: ReferCase) => {
    const initialState = {
      list: [{
        refercaseID: post.refercaseID,
        facilityID: post.facilityID,
        tzID: post.refercaseSentTZID ? post.refercaseSentTZID : '',
        doctorID: post.doctorID,
        url: this.router.url
      }]
    };
    this.store.setRejectrefer(JSON.stringify(post));
    this.bsModalRef = this.modalService.show(RejectReceivedModalComponent, { id: 911, initialState });
    this.bsModalRef.content.event.subscribe((res: string) => {
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
    if (`/${url[2]}` === '/facility-dashboard') {
      this.facilityService.forceReloadOther();
      const data = { data: this.caseViewData, from: 'dashboard' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-referral-received') {
      this.facilityService.forceReloadReceivedAll();
      const data = { data: this.caseViewData, from: 'received' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-referral-sent') {
      const data = { data: this.caseViewData, from: 'insideSent' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-notifications') {
      const data = { data: this.caseViewData, from: 'notifications' };
      this.store.setReferView(JSON.stringify(data));
    }
    this.router.navigate([`/${url[1]}/${url[2]}`]);
  }
  checkWhereToNavigateRejected = () => {
    const url = this.router.url.split('/');
    this.caseViewData.refercaseStatus = 'Rejected';
    if (`/${url[2]}` === '/facility-dashboard') {
      this.facilityService.forceReloadOther();
      const data = { data: this.caseViewData, from: 'dashboard' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-referral-received') {
      this.facilityService.forceReloadReceivedAll();
      const data = { data: this.caseViewData, from: 'received' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-referral-sent') {
      const data = { data: this.caseViewData, from: 'insideSent' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-notifications') {
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
  onClickRereferDashboard = (data: ReferCase) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-dashboard/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferSent = (data: ReferCase) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-referral-sent/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferReceived = (data: ReferCase) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-referral-received/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferDoctorsList = (data: ReferCase) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-doctors-list/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferNotification = (data: ReferCase) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-notifications/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferAdd = (data: ReferCase) => {
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-add-refer-case/re-refer-case']);
    this.cd.markForCheck();
  }
  editCase = (data: ReferCase) => {
    this.store.setEditrefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-referral-sent/edit-refer-case']);
  }
  deleteCase = (refercaseID: string) => {
    const initialState = {
      list: [{ refercaseID }]
    };
    this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, {
        id: 919,
        initialState,
        animated: false,
        ignoreBackdropClick: true,
        keyboard: false,
        // class: 'modal-dialog-centered'
      });
    this.bsModalRef.content.event.subscribe((res: string) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        this.facilityService.forceReloadSentList();
        const url = this.router.url.split('/');
        if (`/${url[2]}` === '/notifications') {
          this.facilityService.forceReloadNotify();
          this.store.setReferView(null);
        }
        this.location.back();
      }
    });
  }
}
