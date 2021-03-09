import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';
interface Reject {
  rejectRemark: string;
}
@Component({
  selector: 'app-reject-received-modal',
  templateUrl: './reject-received-modal.component.html',
  styleUrls: ['./reject-received-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RejectReceivedModalComponent implements OnInit {
  list: any[] = [];
  rejectDefault = false;
  rejectForm: FormGroup;
  refercaseID: string;
  facilityID: string;
  doctorID: string;
  event: EventEmitter<any> = new EventEmitter();
  tzID: string;
  constructor(
    private bsModalRef: BsModalRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private facilityService: FacilityService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private service: HomeService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.rejectForm = this.fb.group({
      rejectRemark: ['']
    });
  }

  ngOnInit(): void {
    this.refercaseID = this.list[0].refercaseID ? this.list[0].refercaseID : '';
    this.facilityID = this.list[0].facilityID;
    this.doctorID = this.list[0].doctorID;
    this.tzID = this.list[0].tzID ? this.list[0].tzID : '';
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
  onCloseReject = (modalID: number) => {
    this.modalService.hide(modalID);
  }
  onReRefer = () => {
    if (
      this.list[0].url.split('?')[0] === '/facility/facility-dashboard' || this.list[0].url === '/facility/facility-dashboard/view-refer'
    ) {
      this.router.navigate(['/facility/facility-dashboard/reject-re-refer-case']);
    }
    if (
      this.list[0].url.split('?')[0] === '/facility/facility-referral-received' || this.list[0].url === '/facility/facility-referral-received/view-refer'
    ) {
      this.router.navigate(['/facility/facility-referral-received/reject-re-refer-case']);
    }
  }
  onReject = (rejectRemark: Reject) => {
    this.spinner.show();
    const data = {
      languageID: '1',
      refercaseID: this.refercaseID,
      facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
      tzID: this.tzID,
      timelineRemarks: rejectRemark.rejectRemark ? rejectRemark.rejectRemark : '',
      newDate: '',
      newTime: '',
      doctorID: this.doctorID ? this.doctorID : '0'
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
