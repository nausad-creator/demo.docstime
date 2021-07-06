import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
interface Doctor {
  cityID: string;
  degreeID: string;
  degreeName: string;
  doctorAbout: string;
  doctorAddress: string;
  doctorEmail: string;
  doctorFax: string;
  doctorFirstName: string;
  doctorFullName: string;
  doctorGender: string;
  doctorID: string;
  doctorLastName: string;
  doctorLatitude: string;
  doctorLongitude: string;
  doctorMobile: string;
  doctorNPI: string;
  doctorOTP: string;
  doctorStatus: string;
  doctorbadgeCount: string;
  facility: Facility[];
  facilityID: string;
  facilityIDs: string;
  facilityName: string;
  facilityTzID: string;
  doctorProfileImage: string;
  speciality: Speciality[];
  isPending: boolean;
}
interface Facility {
  doctorID: string;
  doctorfacilityID: string;
  facilityID: string;
  facilityName: string;
  removeRequest: string;
}
interface Speciality {
  doctorID: string;
  doctorspecialityCreatedDate: string;
  doctorspecialityID: string;
  specialityID: string;
  specialityName: string;
}
@Component({
  selector: 'app-shared-list-doctors',
  template: `<div class="appointmen-list card mb-3">
  <div class="row align-items-center" style="cursor: pointer;color: #007bff" (click)="onClickView(wholeObject)">
      <div class="col-md-8 text-appont">
          <a class="d-flex align-items-center">
              <div class="img-candate">
                  <img [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="url" [errorImage]="'assets/img/user-icon.png'"
                      alt="candidate">
              </div>
              <div class="nameCandate">
                  <h5 class="mt-2 mb-1" *ngIf="doctorFullName">{{preFixDRstr === 'DR.' ? (doctorFullName | titlecase) : 'Dr. ' + (doctorFullName | titlecase)}}</h5>
                  <p class="text-dark mb-0" *ngIf="specialityName && specialityName !== null && specialityName !== undefined">
                      <span>{{specialityName}}</span></p>
              </div>
          </a>
      </div>
      <div class="col-md-4 text-appont">
          <a *ngIf="wholeObject.facilityID !== facilityID && !wholeObject.isPending" title="Delete" (click)="onDelete(wholeObject.doctorID); $event.stopPropagation();" style="cursor: pointer;color: #dd5709; float: right;" class="d-flex align-items-center">
              <i class="fa fa-trash" aria-hidden="true"></i>
          </a>
          <a *ngIf="wholeObject.facilityID !== facilityID && wholeObject.isPending" title="Pending" style="color: #dd5709; float: right;" class="d-flex align-items-center">
              <i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;Pending
          </a>
      </div>
  </div>
</div>`,
  styles: [`.img-candate {
    margin-right: 15px;
  }
  .img-candate img {
    height: 50px;
    width: 50px;
    border-radius: 50px;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedListDoctorsComponent implements OnInit {
  @Input() doctorFullName: string;
  @Input() doctorGender: string;
  @Input() doctorProfileImage: string;
  @Input() specialityName: string;
  @Input() facilityID: string;
  @Input() wholeObject: Doctor;
  @Output() view: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();
  url = '';
  preFixDRstr: string;
  baseUrl = `${environment.fileUrl}`;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.url = `${this.baseUrl}/doctor/${this.doctorProfileImage}`;
    this.preFixDRstr = this.doctorFullName.substr(0, 3);
    this.cd.markForCheck();
  }
  onClickView = (obj: any) => {
    this.view.emit(obj);
  }
  onDelete = (doctorID: string) => {
    this.update.emit(doctorID);
  }
}
