import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { ConfirmedReceivedModalComponent } from '../../confirmed-received-modal/confirmed-received-modal.component';
import { ReferCase } from '../../docs.interface';
import { RejectReceivedModalComponent } from '../../reject-received-modal/reject-received-modal.component';
import { Store } from '../../store.service';

@Component({
  selector: 'app-share-referral-received',
  template: `
  <div class="appointmen-list card mb-3" *ngIf="refercaseStatus === 'Pending'" style="cursor: pointer;" (click)="onClickViewReferral(wholeObject)">
    <div class="d-flex text-appont">
      <a class="referred-btn">
      <h5 class="m-0 text-dark" *ngIf="fullName">{{fullName | titlecase}}</h5></a>
      <p class="m-0 text-dark ml-auto">{{genderAtZero + '/' + age + ' ' + 'yrs' + '' + (refSpecialityName | titlecase)}}</p>
    </div>
      <div class="row align-items-center">
        <div class="col-md-5 text-appont">
            <p class="m-0">{{reasonName | titlecase}}</p>
            <a class="d-flex align-items-center" style="cursor:pointer;color:#007bff;">
              <div class="img-candate mr-2"><img alt="candidate" [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="url" [errorImage]="'assets/img/user-icon.png'"
                alt="candidate" height="50"></div>
              <div class="nameCandate">
                <h5 class=" mb-0 ng-star-inserted" [title]="preFixDRstr === 'DR.' ? doctorFullName : 'Dr. ' + doctorFullName" *ngIf="doctorFullName">{{preFixDRstr === 'DR.' ? (doctorFullName | titlecase) : 'Dr. ' + (doctorFullName | titlecase)}}</h5>
                <p class="mb-0 ng-star-inserted" *ngIf="specialityName">{{specialityName | titlecase}}</p>
              </div>
            </a>
        </div>
        <div class="col-md-3 icons-dated" >
        <p class="m-0" *ngIf="refercaseVisitDate"><i class="ti-calendar"></i> {{refercaseVisitDate | date : 'mediumDate'}}</p>
        <p class="m-0" *ngIf="refercaseVisitTime"><i class="ti-time"></i> {{convertedTime}}</p>
        </div>
        <div class="col-md-4 text-xl-right btnsgrp-appointment">
        <p class="mb-2 actiontimeline-icons">
            <a class="comment cursr" title="Mail" (click)="mail(wholeOBject.patientEmail); $event.stopPropagation();"><i class="fa fa-envelope"></i></a>
        </p>
        <p  class="text-dark sb-text mb-2" *ngIf="refercaseUrgent === 'Yes'">Urgent Consult</p>
        </div>
        <div class="col-md-12 text-right">
          <a (click)="openModalConfirm(); $event.stopPropagation();" class="btn btn-outline-primary btn-sm" *ngIf="refercaseStatus === 'Pending'">Confirm/Reschedule</a>
          <a (click)="openModalReject(); $event.stopPropagation();" class="btn btn-outline-primary m-1 btn-sm" *ngIf="refercaseStatus === 'Pending'">Reject</a>
        </div>
      </div>
    </div>

    <!-- confirmed, rejected and expired -->
    <div class="appointmen-list card mb-3" *ngIf="refercaseStatus === 'Accepted' || refercaseStatus === 'Rejected' || refercaseStatus === 'Expired'" style="cursor: pointer;" (click)="onClickViewReferral(wholeObject)">
      <div class="d-flex text-appont" >
        <a class="referred-btn">
          <h5 class="m-0 text-dark" *ngIf="fullName">{{fullName | titlecase}}</h5></a>
        <p class="m-0 text-dark ml-auto">{{genderAtZero + '/' + age + ' ' + 'yrs' + '' + (refSpecialityName | titlecase)}}</p>
      </div>
        <div class="row align-items-center">
          <div class="col-md-5 text-appont" >
              <p class="m-0">{{reasonName | titlecase}}</p>
              <a class="d-flex align-items-center" style="color:#007bff;">
                <div class="img-candate mr-2"><img alt="candidate" [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="url" [errorImage]="'assets/img/user-icon.png'"
                  alt="candidate" height="50"></div>
                <div class="nameCandate">
                  <h5 class=" mb-0 ng-star-inserted" [title]="preFixDRstr === 'DR.' ? doctorFullName : 'Dr. ' + doctorFullName" *ngIf="doctorFullName">{{preFixDRstr === 'DR.' ? (doctorFullName | titlecase) : 'Dr. ' + (doctorFullName | titlecase)}}</h5>
                  <p class="mb-0 ng-star-inserted" *ngIf="specialityName">{{specialityName | titlecase}}</p>
                </div>
              </a>
          </div>
          <div class="col-md-3 icons-dated" >
            <p class="m-0" *ngIf="refercaseVisitDate"><i class="ti-calendar"></i> {{refercaseVisitDate | date : 'mediumDate'}}</p>
            <p class="m-0" *ngIf="refercaseVisitTime"><i class="ti-time"></i>{{convertedTime}}</p>
          </div>
          <div class="col-md-4 text-xl-right btnsgrp-appointment">
            <p class="mb-2 actiontimeline-icons">
              <a class="comment cursr" title="Mail" (click)="mail(wholeOBject.patientEmail); $event.stopPropagation();"><i class="fa fa-envelope"></i></a>
           </p>
            <p  class="text-dark sb-text mb-2" *ngIf="refercaseUrgent === 'Yes'">Urgent Consult</p>
            <div  class="text-success" *ngIf="refercaseStatus === 'Accepted'"><img src="assets/img/check-icon.svg" alt="" height="15px"> Confirmed</div>
            <div  class="text-danger" *ngIf="refercaseStatus === 'Rejected'"><img src="assets/img/close-icon.svg" alt="" height="15px"> Rejected</div>
            <div  class="text-muted" *ngIf="refercaseStatus === 'Expired'"><i class="ti-na"></i> Expired</div>
          </div>
        </div>
      </div>
 `,
  styles: [`.img-candate {
    margin-right: 15px;
  }
  .img-candate img {
    height: 50px;
    width: 50px;
    border-radius: 50px;
  }
  .sb-text {
    font-weight: bold;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareReferralReceivedComponent implements OnInit {
  @Input() patientFirstName: string;
  @Input() patientLastName: string;
  @Input() reasonName: string;
  @Input() patientGender: string;
  @Input() doctorFullName: string;
  @Input() doctorProfileImage: string;
  @Input() specialityName: string;
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
  @Input() wholeObject: ReferCase;
  @Output() view: EventEmitter<any> = new EventEmitter();
  @Output() updateView: EventEmitter<any> = new EventEmitter();
  genderAtZero: string;
  fullName: string;
  convertedTime: string;
  preFixDRstr: string;
  bsModalRef: BsModalRef;
  baseUrl = `${environment.fileUrl}`;
  url: string;
  constructor(
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private store: Store,
    private router: Router,
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
    this.bsModalRef.content.event.subscribe((res: string) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        this.updateView.emit();
      }
    });
  }
  openModalReject = () => {
    const initialState = {
      list: [{
        refercaseID: this.refercaseID,
        facilityID: this.facilityID,
        doctorID: this.doctorID,
        tzID: this.refercaseSentTZID ? this.refercaseSentTZID : '',
        url: this.router.url
      }]
    };
    this.store.setRejectrefer(JSON.stringify(this.wholeObject));
    this.bsModalRef = this.modalService.show(RejectReceivedModalComponent, { id: 911, initialState, class: 'modal-sm' });
    this.bsModalRef.content.event.subscribe((res: string) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        this.updateView.emit('Update');
      }
    });
  }
  onClickViewReferral = (referral: ReferCase) => {
    this.view.emit(JSON.stringify(referral));
  }
  mail = (email?: string) => {
    window.location.href = `mailto:${email}?subject=&body=`; // add the links to body
  }
}
