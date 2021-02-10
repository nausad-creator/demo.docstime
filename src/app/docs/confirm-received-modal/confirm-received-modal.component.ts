import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';
import { DocsService } from '../docs.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-confirm-received-modal',
  templateUrl: './confirm-received-modal.component.html',
  styleUrls: ['./confirm-received-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmReceivedModalComponent implements OnInit {
  confirmForm: FormGroup;
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
  editInput = false;
  min: Date;
  minTime: Date;
  error: string;
  refercaseVisitTime: string;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(
    public bsModalRef: BsModalRef,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public docService: DocsService,
    public service: HomeService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.confirmForm = this.fb.group({
      refercaseVisitDate: [''],
      refercaseVisitTime: ['']
    });
    // for disabling previous dates from current date
    let month: any;
    let day: any;
    const dtToday = new Date();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    const year = dtToday.getFullYear();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    this.min = new Date(year, month - 1, day);
  }

  ngOnInit(): void {
    this.fullName = this.list[0].name ? this.list[0].name : '';
    this.convertedTime = this.list[0].convertedTime !== 'Undefined' && this.list[0].convertedTime ? this.list[0].convertedTime : '';
    this.genderAtZero = this.list[0].genderAtZero ? this.list[0].genderAtZero : '';
    this.refercaseVisitDate = this.list[0].refercaseVisitDate !== 'Undefined' && this.list[0].refercaseVisitDate ?
      this.list[0].refercaseVisitDate : '';
    this.age = this.list[0].age ? this.list[0].age : '';
    this.reasonName = this.list[0].reasonName ? this.list[0].reasonName : '';
    this.refercaseID = this.list[0].refercaseID ? this.list[0].refercaseID : '';
    this.refSpecialityName = this.list[0].refSpecialityName ? this.list[0].refSpecialityName : '';
    this.refercaseVisitTime = this.list[0].refercaseVisitTime !== 'Undefined' &&
      this.list[0].refercaseVisitTime ? this.list[0].refercaseVisitTime : '';
    this.facilityID = this.list[0].facilityID;
    // form data
    this.confirmForm.get('refercaseVisitTime').valueChanges.pipe().subscribe(() => { this.check(); });
    this.confirmForm.get('refercaseVisitDate').valueChanges.pipe().subscribe(() => {
      const date1 = new Date();
      date1.setHours(0, 0, 0, 0);
      const date2 = new Date(this.confirmForm.get('refercaseVisitDate').value);
      if (date1.getTime() === date2.getTime()) {
        this.minTime = new Date();
      } else {
        this.minTime = null;
      }
      this.confirmForm.get('refercaseVisitTime').patchValue('', { emitEvent: false });
      this.confirmForm.get('refercaseVisitTime').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    });
  }
  check = () => {
    if (this.confirmForm.get('refercaseVisitDate').value === '') {
      this.confirmForm.get('refercaseVisitTime').patchValue('', { emitEvent: false });
      this.confirmForm.get('refercaseVisitTime').setErrors({ emptyDate: true });
      this.cd.markForCheck();
    } else {
      this.confirmForm.get('refercaseVisitTime').setErrors(null);
      this.confirmForm.get('refercaseVisitTime').updateValueAndValidity({ emitEvent: false });
      if (this.confirmForm.get('refercaseVisitTime').value) {
        this.error = '';
      }
      this.cd.markForCheck();
    }
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
  onClickChange = () => {
    if (this.refercaseVisitDate) {
      this.confirmForm.get('refercaseVisitDate').patchValue(this.refercaseVisitDate, { emitEvent: false });
      const date2 = new Date(this.confirmForm.get('refercaseVisitDate').value);
      const date1 = new Date();
      date1.setHours(0, 0, 0, 0);
      date2.setHours(0, 0, 0, 0);
      if (date1.getTime() === date2.getTime()) {
        this.minTime = new Date();
      } else {
        this.minTime = null;
      }
      this.cd.markForCheck();
    }
    if (this.refercaseVisitDate && this.refercaseVisitTime) {
      this.confirmForm.get('refercaseVisitTime').patchValue(moment(`${this.refercaseVisitDate} ${this.refercaseVisitTime}`).toDate());
      this.confirmForm.get('refercaseVisitTime').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
  }
  onConfirm = () => {
    if (!this.refercaseVisitDate && !this.convertedTime && !this.confirmForm.get('refercaseVisitDate').value && !this.confirmForm.get('refercaseVisitTime').value) {
      this.error = 'Please select date & time.';
      this.cd.markForCheck();
    } else if (!this.convertedTime && !this.editInput) {
      this.error = 'Please select time.';
      this.cd.markForCheck();
    } else if (this.editInput && !this.confirmForm.get('refercaseVisitTime').value) {
      this.error = 'Please select time.';
      this.cd.markForCheck();
    } else {
      this.error = '';
      this.spinner.show();
      const data = {
        languageID: '1',
        refercaseID: this.refercaseID,
        facilityID: this.facilityID,
        newDate: this.confirmForm.get('refercaseVisitDate').value ?
        moment(this.confirmForm.get('refercaseVisitDate').value, 'YYYY-MM-DD').format('YYYY-MM-DD') : '',
        newTime: this.confirmForm.get('refercaseVisitTime').value ?
        moment(this.confirmForm.get('refercaseVisitTime').value, 'h:mm:ss A').format('HH:mm:ss') : '',
        doctorID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID
      };
      this.docService.acceptReferral(JSON.stringify(data)).subscribe(
        (res) => {
          if (res[0].status === 'true') {
            setTimeout(() => {
              this.triggerEvent(JSON.stringify({
                res: 'confirmed',
                refercaseVisitDate: this.editInput ? this.confirmForm.get('refercaseVisitDate').value : this.refercaseVisitDate
              }));
              this.service.nextCountNotificationAndReferral(this.refercaseID);
              this.docService.forceReloadNotify();
              this.bsModalRef.hide();
              this.spinner.hide();
              this.toastr.success('Accepted successfully');
            }, 500);
          } else {
            this.spinner.hide();
            setTimeout(() => {
              this.error = res[0].message;
              this.cd.markForCheck();
            });
          }
        }, error => {
          this.spinner.hide();
          console.error(error);
          setTimeout(() => {
            this.error = 'some error occured, please try again later.';
            this.cd.markForCheck();
          });
        });
    }
  }
  triggerEvent = (data: string) => {
    this.event.emit(data);
  }
}
