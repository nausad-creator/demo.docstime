import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';
import { DocsService } from '../docs.service';
interface Reject {
  rejectRemark: string;
}
@Component({
  selector: 'app-reject-received-modal',
  templateUrl: './reject-received-modal.component.html',
  styleUrls: ['./reject-received-modal.component.css']
})
export class RejectReceivedModalComponent implements OnInit {
  list: any[] = [];
  rejectDefault = false;
  rejectForm: FormGroup;
  refercaseID: string;
  facilityID: string;
  tzID: string;
  event: EventEmitter<string> = new EventEmitter();
  constructor(
    private bsModalRef: BsModalRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private docService: DocsService,
    private service: HomeService,
    private router: Router,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.rejectForm = this.fb.group({
      rejectRemark: ['']
    });
  }

  ngOnInit(): void {
    this.refercaseID = this.list[0].refercaseID ? this.list[0].refercaseID : '';
    this.facilityID = this.list[0].facilityID ? this.list[0].facilityID : '0';
    this.tzID = this.list[0].tzID ? this.list[0].tzID : '';
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
  onCloseReject = (modalID: number) => {
    this.modalService.hide(modalID);
  }
  onReject = (rejectRemark: Reject) => {
    this.spinner.show();
    const data = {
      languageID: '1',
      refercaseID: this.refercaseID,
      facilityID: this.facilityID,
      tzID: this.tzID,
      timelineRemarks: rejectRemark.rejectRemark ? rejectRemark.rejectRemark : '',
      newDate: '',
      newTime: '',
      doctorID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID
    };
    this.docService.rejectReferral(JSON.stringify(data)).subscribe(
      (res) => {
        if (res[0].status === 'true') {
          setTimeout(() => {
            this.triggerEvent(JSON.stringify({
              res: 'confirmed',
              refercaseVisitDate: ''
            }));
            this.service.nextCountNotificationAndReferral(this.refercaseID);
            this.docService.forceReloadNotify();
            this.bsModalRef.hide();
            this.spinner.hide();
            this.toastr.success('Rejected successfully');
          }, 100);
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
