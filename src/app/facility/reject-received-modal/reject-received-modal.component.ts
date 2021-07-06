import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  template: `<div class="modal-contents">
  <div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel">{{rejectDefault ? 'Reject-Referral' : 'Alert'}}</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="onClose()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p [hidden]="rejectDefault">Do you want to reject the referral?</p>
    <form class="" [formGroup]="rejectForm" [hidden]="!rejectDefault">
      <div class="row">
        <div class="col-sm-12">
          <label for="Discription">Remarks</label>
          <div class="form-group">
            <textarea class="form-control" formControlName="rejectRemark" name="Discription" id="Discription"
              type="text" placeholder="Write here...(Optional)" rows="3"></textarea>
          </div>
        </div>
      </div>
    </form>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="rejectDefault = true"
      [hidden]="rejectDefault">Reject</button>
    <button type="button" class="btn btn-primary" (click)="onReject(rejectForm.value)"
      [hidden]="!rejectDefault">Submit</button>
  </div>
</div>`,
  styles: [`.modal-contents {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: .3rem;
    outline: 0;
}`],
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
    private service: HomeService,
    private fb: FormBuilder,
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
          }, 50);
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
