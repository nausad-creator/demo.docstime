import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReferCase } from '../../docs.interface';

@Component({
  selector: 'app-share-schedule-appointments',
  template: `
  <div class="appointmen-list card mb-3" style="cursor: pointer;" (click)="onClickViewUpcomming(wholeObject)">
      <div class="d-flex text-appont">
        <a class="referred-btn">
          <h5 class="m-0 text-dark">{{fullName | titlecase}}</h5></a>
        <p class="m-0 text-dark ml-auto">{{genderAtZero + '/' + age + ' ' + 'yrs' + '' + (refSpecialityName | titlecase)}}</p>
      </div>
        <div class="row align-items-center">
          <div class="col-md-5 text-appont">
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
          <div class="col-md-3 icons-dated">
            <p class="m-0" *ngIf="refercaseVisitDate"><i class="ti-calendar"></i> {{refercaseVisitDate | date : 'mediumDate'}}</p>
            <p class="m-0" *ngIf="refercaseVisitTime"><i class="ti-time"></i>{{convertedTime}}</p>
          </div>
          <div class="col-md-4 text-xl-right btnsgrp-appointment" *ngIf="refercaseStatus === 'Accepted'">
            <p class="mb-2 actiontimeline-icons">
              <a class="comment cursr" title="Mail" (click)="mail(wholeOBject.patientEmail); $event.stopPropagation();"><i class="fa fa-envelope"></i></a>
           </p>
            <p  class="text-dark sb-text mb-2" *ngIf="refercaseUrgent === 'Yes'">Urgent Consult</p>
            <div  class="text-success"><img src="assets/img/check-icon.svg" alt="" height="15px"> Confirmed</div>
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
export class ShareScheduleAppointmentsComponent implements OnInit {
  @Input() patientFirstName: string;
  @Input() patientLastName: string;
  @Input() doctorFullName: string;
  @Input() doctorProfileImage: string;
  @Input() specialityName: string;
  @Input() reasonName: string;
  @Input() patientGender: string;
  @Input() age: string;
  @Input() refercaseUrgent: string;
  @Input() refSpecialityName: string;
  @Input() refercaseVisitDate: string;
  @Input() refercaseVisitTime: string;
  @Input() refercaseStatus: string;
  @Input() wholeObject: any;
  @Output() view: EventEmitter<any> = new EventEmitter();
  genderAtZero: string;
  fullName: string;
  convertedTime: string;
  preFixDRstr: string;
  baseUrl = `${environment.fileUrl}`;
  url: string;
  constructor(private cd: ChangeDetectorRef) { }

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
  mail = (email?: string) => {
    window.location.href = `mailto:${email}?subject=&body=`; // add the links to body
  }
  onClickViewUpcomming = (referral: ReferCase) => {
    this.view.emit(JSON.stringify(referral));
  }
}
