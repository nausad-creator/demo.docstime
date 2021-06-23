import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { merge, Observable, Subject } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { NpiModalComponent } from '../npi-modal/npi-modal.component';
import { DortorViewComponent } from '../dortor-view/dortor-view.component';
import { FacilityService } from '../facility.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
  selector: 'app-doctors-listing',
  templateUrl: './doctors-listing.component.html',
  styleUrls: ['./doctors-listing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorsListingComponent implements OnInit {
  show = 10;
  throttle = 10;
  scrollDistance = 0.3;
  doctorList$: Observable<Doctor[]>;
  forceReload$ = new Subject<void>();
  bsModalRef: BsModalRef;
  facilityID = this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID;
  constructor(
    private service: HomeService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private fservice: FacilityService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    const initialValue$ = this.getDataOnce();
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce() as Observable<Doctor[]>));
    this.doctorList$ = merge(initialValue$, updates$);
    this.service.updateDoctors.subscribe((isTrue) => isTrue ? this.forceReload() : '');
    this.cd.markForCheck();
  }
  getDataOnce = () => {
    return this.service.getDoctors.pipe(
      map((res) => res[0].data.map((o: Doctor) => {
        return {
          doctorFullName: `${o.doctorFullName ? o.doctorFullName : ''}`,
          doctorFirstName: `${o.doctorFirstName ? o.doctorFirstName : ''}`,
          doctorLastName: `${o.doctorLastName ? o.doctorLastName : ''}`,
          doctorMobile: o.doctorMobile ? o.doctorMobile : '',
          doctorAddress: `${o.doctorAddress ? o.doctorAddress : ''}`,
          doctorGender: `${o.doctorGender ? o.doctorGender : ''}`,
          doctorNPI: `${o.doctorNPI ? o.doctorNPI : ''}`,
          doctorFax: `${o.doctorFax ? o.doctorFax : ''}`,
          speciality: o.speciality,
          degreeName: `${o.degreeName ? o.degreeName : ''}`,
          facilityName: `${o.facilityName ? o.facilityName : ''}`,
          doctorEmail: `${o.doctorEmail ? o.doctorEmail : ''}`,
          doctorProfileImage: `${o.doctorProfileImage ? o.doctorProfileImage : ''}`,
          doctorID: o.doctorID,
          facility: o.facility,
          facilityID: o.facilityID,
          isPending: o.facility.length > 0 && o.facilityID !== this.facilityID ? o.facility.filter(f => f.facilityID === this.facilityID)[0].removeRequest === 'Pending' ? true : false : false
        };
      })), take(1)) as Observable<Doctor[]>;
  }
  onScrollEnd = () => {
    this.show += 10;
    this.cd.markForCheck();
  }
  forceReload = () => {
    this.service.forceReload();
    this.forceReload$.next();
    this.service.updateDoctorLists(false);
  }
  openNPIaddDoctor = () => {
    this.bsModalRef = this.modalService.show(NpiModalComponent, { id: 79 });
  }
  openDoctorViewModal = (post: Doctor) => {
    const initialState = {
      list: [{
        doctorFullName: `${post.doctorFullName ? post.doctorFullName : ''}`,
        doctorFirstName: `${post.doctorFirstName ? post.doctorFirstName : ''}`,
        doctorLastName: `${post.doctorLastName ? post.doctorLastName : ''}`,
        doctorMobile: post.doctorMobile ? post.doctorMobile : '',
        doctorAddress: `${post.doctorAddress ? post.doctorAddress : ''}`,
        doctorGender: `${post.doctorGender ? post.doctorGender : ''}`,
        doctorNPI: `${post.doctorNPI ? post.doctorNPI : ''}`,
        doctorFax: `${post.doctorFax ? post.doctorFax : ''}`,
        specialityName: `${post.speciality.length > 0 ? post.speciality[0].specialityName : ''}`,
        degreeName: `${post.degreeName ? post.degreeName : ''}`,
        facilityName: `${post.facilityName ? post.facilityName : ''}`,
        doctorEmail: `${post.doctorEmail ? post.doctorEmail : ''}`,
        doctorProfileImage: `${post.doctorProfileImage ? post.doctorProfileImage : ''}`
      }]
    };
    this.bsModalRef = this.modalService.show(DortorViewComponent, { id: 599, initialState });
  }
  deleteDoctor = (dID: string) => {
    const temp = {
      languageID: '1',
      logindoctorID: dID,
      facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
      removeRemark: 'Please remove!',
    };
    this.fservice.removeDoctor(JSON.stringify(temp)).subscribe(
      r => {
        if (r[0].status === 'true') {
          this.forceReload();
        }
      }, err => {
        console.error(err);
      }, () => this.spinner.hide()
    );
  }
}
