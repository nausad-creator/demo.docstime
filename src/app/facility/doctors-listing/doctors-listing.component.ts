import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { merge, Observable, Subject } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { NpiModalComponent } from '../npi-modal/npi-modal.component';
import { DortorViewComponent } from '../dortor-view/dortor-view.component';
interface Doctor {
  doctorAddress: string;
  doctorFirstName: string;
  doctorFullName: string;
  doctorID: string;
  doctorLastName: string;
  doctorNPI: string;
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
  doctorList$: Observable<Array<Doctor>>;
  forceReload$ = new Subject<void>();
  bsModalRef: BsModalRef;
  constructor(
    private service: HomeService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const initialValue$ = this.getDataOnce();
    const updates$ = this.forceReload$.pipe(mergeMap(() => this.getDataOnce() as Observable<Array<Doctor>>));
    this.doctorList$ = merge(initialValue$, updates$);
    this.cd.markForCheck();
    this.service.updateDoctors.subscribe((isTrue) => isTrue ? this.forceReload() : '');
    this.cd.markForCheck();
  }
  getDataOnce = () => {
    return this.service.getDoctors.pipe(map(res => res[0].data), take(1)) as Observable<Array<Doctor>>;
  }
  onScrollEnd = () => {
    this.show += 10;
    this.cd.markForCheck();
  }
  onScrollUp = () => {
    console.log('scrolled up!!');
  }
  forceReload = () => {
    this.service.forceReload();
    this.forceReload$.next();
    this.service.updateDoctorLists(false);
  }
  openNPIaddDoctor = () => {
    this.bsModalRef = this.modalService.show(NpiModalComponent, { id: 79 });
  }
  openDoctorViewModal = (post: any) => {
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
}
