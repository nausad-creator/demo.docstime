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
  templateUrl: './shared-list-doctors.component.html',
  styleUrls: ['./shared-list-doctors.component.css'],
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
