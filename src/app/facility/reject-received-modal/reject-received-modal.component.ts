import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';
import { ConfirmedReceivedModalComponent } from '../confirmed-received-modal/confirmed-received-modal.component';
import { FacilityService } from '../facility.service';

@Component({
  selector: 'app-reject-received-modal',
  templateUrl: './reject-received-modal.component.html',
  styleUrls: ['./reject-received-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RejectReceivedModalComponent implements OnInit {
  list: any[] = [];
  fullName: string;
  convertedTime: string;
  genderAtZero: string;
  refercaseVisitDate: string;
  age: string;
  reasonName: string;
  refercaseID: string;
  refSpecialityName: string;
  facilityID: string;
  doctorID: string;
  refercaseVisitTime: string;
  event: EventEmitter<any> = new EventEmitter();
  constructor(
    private bsModalRef: BsModalRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private facilityService: FacilityService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private service: HomeService
  ) { }

  ngOnInit(): void {
    this.fullName = this.list[0].name ? this.list[0].name : '';
    this.convertedTime = this.list[0].convertedTime ? this.list[0].convertedTime : '';
    this.genderAtZero = this.list[0].genderAtZero ? this.list[0].genderAtZero : '';
    this.refercaseVisitDate = this.list[0].refercaseVisitDate ? this.list[0].refercaseVisitDate : '';
    this.age = this.list[0].age ? this.list[0].age : '';
    this.reasonName = this.list[0].reasonName ? this.list[0].reasonName : '';
    this.refercaseID = this.list[0].refercaseID ? this.list[0].refercaseID : '';
    this.refSpecialityName = this.list[0].refSpecialityName ? this.list[0].refSpecialityName : '';
    this.refercaseVisitTime = this.list[0].refercaseVisitTime !== 'Undefined' &&
      this.list[0].refercaseVisitTime ? this.list[0].refercaseVisitTime : '';
    this.facilityID = this.list[0].facilityID;
    this.doctorID = this.list[0].doctorID;
    this.cd.markForCheck();
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
  onOpenConfirmation = () => {
    this.bsModalRef.hide();
    setTimeout(() => {
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
    }, 600);
  }
  onReject = () => {
    this.spinner.show();
    const data = {
      languageID: '1',
      refercaseID: this.refercaseID,
      facilityID: this.facilityID,
      newDate: '',
      newTime: '',
      doctorID: this.doctorID
    };
    this.facilityService.rejectReferral(JSON.stringify(data)).subscribe(
      (res) => {
        if (res[0].status === 'true') {
          setTimeout(() => {
            this.triggerEvent(JSON.stringify({
              res: 'confirmed',
              refercaseVisitDate: ''
            }));
            this.service.nextCountNotificationAndReferral(this.refercaseID);
            this.facilityService.forceReloadNotify();
            this.bsModalRef.hide();
            this.spinner.hide();
            this.toastr.success('Rejected successfully');
          }, 500);
        } else {
          this.spinner.hide();
          setTimeout(() => {
            this.toastr.error(res[0].message);
          });
        }
      }, error => {
        this.spinner.hide();
        console.error(error);
        setTimeout(() => {
          this.toastr.error('some error occured, please try again later.');
        });
      });
  }
  triggerEvent = (data: string) => {
    this.event.emit(data);
  }
}