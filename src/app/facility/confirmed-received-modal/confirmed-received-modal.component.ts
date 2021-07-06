import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';

@Component({
  selector: 'app-confirmed-received-modal',
  template: `<div class="modal-contents modal-login">
  <div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel">Referral Details</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="onClose()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <!-- error handler -->
    <div class="alert alert-danger" role="alert" *ngIf="error">
      <h5 class="alert-heading text-center">Error!</h5>
      <p class="mb-0 text-center">{{error}}</p>
    </div>
    <!-- handler end -->
    <div class="reffral-detail">
      <div class="itme-reffarl">
        <p>
          {{(fullName | titlecase) + ' ' + genderAtZero + '/' + age + ' ' + 'yrs' + '' + (refSpecialityName | titlecase)}}
        </p>
      </div>
      <div class="itme-reffarl">
        <p>{{reasonName | titlecase}}</p>
      </div>
      <div class="itme-reffarl">
        <p>{{(refercaseVisitDate | date : 'mediumDate') + ' ' + convertedTime}}<a
            style="margin-left: 2px; cursor: pointer; color: #007bff" (click)="editInput = false; onClickChange()"
            *ngIf="editInput">Edit</a></p>
      </div>
      <div [hidden]="editInput">
        <div class="" [formGroup]="confirmForm">
          <div class="row">
            <div class="col-sm-6">
              <label for="dov">Date of Visit</label>
              <div class="form-group inputWithIcon">
                <input class="form-control" maxlength=14 #visitDate (keyup)="onTypeVisitDate(visitDate.value)"
                  (blur)="onBlurVisitDate(visitDate.value)" [min]="min" placeholder="mm/dd/yyyy"
                  formControlName="refercaseVisitDate" id="dov" name="dov" [owlDateTime]="dt3">
                <a class="cursr"><i [owlDateTimeTrigger]="dt3" class="ti-calendar cursr"></i></a>
                <owl-date-time [pickerType]="'calendar'" #dt3></owl-date-time>
                <small class="text-danger small"
                  *ngIf="confirmForm.get('refercaseVisitDate').invalid && confirmForm.controls['refercaseVisitDate'].hasError('owlDateTimeMin')">Date
                  should not before {{min | date: 'mediumDate'}}</small>
                <small class="text-danger small"
                  *ngIf="confirmForm.controls['refercaseVisitDate'].hasError('emptyDate')">Please
                  select Date of Visit.</small>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="dov">Time of Visit</label>
              <div class="form-group inputWithIcon">
                <input class="form-control" oninput="this.value = this.value.replace(/^\s+/g, '')" [min]="minTime"
                  placeholder="hh:mm am/pm" formControlName="refercaseVisitTime" name="time" id="time"
                  [owlDateTime]="dt4">
                <a class="cursr"><i [owlDateTimeTrigger]="dt4" class="ti-time cursr"></i></a>
                <owl-date-time [hour12Timer]="true" [startAt]="startAt" [stepMinute]="15" [pickerType]="'timer'" #dt4></owl-date-time>
                <small class="text-danger small"
                  *ngIf="confirmForm.controls['refercaseVisitTime'].hasError('emptyDate')">Please
                  select Date of visit first.</small>
                <small class="text-danger small"
                  *ngIf="confirmForm.get('refercaseVisitTime').invalid && confirmForm.controls['refercaseVisitTime'].hasError('owlDateTimeMin')">Please
                  enter valid time.</small>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="pr-3 pb-3 pt-3 pl-0" [ngClass]="{'pl-3': !editInput}"> <br>
      <button type="button" class="btn btn-primary btn-lg" [ngClass]="{'btn-block': !editInput, 'btn-mrgin': editInput}"
        (click)="onConfirm()">{{editInput ? 'Yes, I Confirm' : 'Confirm'}}</button>
      <button type="button" class="btn btn-primary btn-lg" (click)="editInput = false; onClickChange()"
        [hidden]="!editInput">Reschedule</button>
    </div>
  </div>
</div>
`,
  styles: [`.form{
    display: block;
    width: 35%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
::ng-deep .cdk-overlay-container {
    z-index: 1200 !important;
  }
  .modal-contents {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: .3rem;
    outline: 0;
}
.inputWithIcon input [id="dov"] {
  padding-right: 40px;
}

.inputWithIcon input [id="time"] {
  padding-right: 40px;
}
.inputWithIcon {
  position: relative;
}
.inputWithIcon i {
  position: absolute;
  right: 0px;
  top: 3px;
  padding: 9px 7px;
}
input[name="dov"] {
  word-spacing:-3px;
}
.btn-mrgin{
  margin-right: 15px;
}`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmedReceivedModalComponent implements OnInit {
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
  doctorID: string;
  editInput = true;
  min: Date;
  startAt: Date;
  minTime: Date;
  error: string;
  refercaseVisitTime: string;
  public event: EventEmitter<any> = new EventEmitter();
  @ViewChild('visitDate', { static: true }) visitDate: ElementRef;
  constructor(
    private bsModalRef: BsModalRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private facilityService: FacilityService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private service: HomeService
  ) {
    this.confirmForm = this.fb.group({
      refercaseVisitDate: [''],
      refercaseVisitTime: ['']
    });
    // for disabling previous dates from current date
    let month: any;
    let day: any;
    const dtToday = new Date();
    let hour = dtToday.getHours();
    const minutes = dtToday.getMinutes();
    const seconds = dtToday.getSeconds();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    const year = dtToday.getFullYear();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    if (minutes >= 45) {
      hour++;
    }
    this.min = new Date(year, month - 1, day);
    this.startAt = new Date
      (
        year, month - 1, day, hour,
        minutes >= 0 && minutes < 15 ? 15 :
          minutes >= 15 && minutes < 30 ? 30 :
            minutes >= 30 && minutes < 45 ? 45 :
              minutes >= 45 ? 0 : 15, seconds
      );
  }

  ngOnInit(): void {
    this.fullName = this.list[0].name ? this.list[0].name : '';
    this.convertedTime = this.list[0].convertedTime !== 'Undefined' && this.list[0].convertedTime ? this.list[0].convertedTime : '';
    this.genderAtZero = this.list[0].genderAtZero ? this.list[0].genderAtZero : '';
    this.refercaseVisitDate = this.list[0].refercaseVisitDate !== 'Undefined' && this.list[0].refercaseVisitDate ? this.list[0].refercaseVisitDate : '';
    this.age = this.list[0].age ? this.list[0].age : '';
    this.reasonName = this.list[0].reasonName ? this.list[0].reasonName : '';
    this.refercaseID = this.list[0].refercaseID ? this.list[0].refercaseID : '';
    this.refSpecialityName = this.list[0].refSpecialityName ? this.list[0].refSpecialityName : '';
    this.refercaseVisitTime = this.list[0].refercaseVisitTime !== 'Undefined' && this.list[0].refercaseVisitTime ? this.list[0].refercaseVisitTime : '';
    this.facilityID = this.list[0].facilityID;
    this.doctorID = this.list[0].doctorID;
    // form data
    this.confirmForm.get('refercaseVisitTime').valueChanges.pipe().subscribe(() => { this.check(); });
    this.confirmForm.get('refercaseVisitDate').valueChanges.pipe().subscribe(() => { this.timeAndDate(); });
  }
  timeAndDate = () => {
    const date1 = new Date();
    let month: any;
    let day: any;
    const dtToday = new Date();
    const year = dtToday.getFullYear();
    let hour = dtToday.getHours();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    const minutes = dtToday.getMinutes();
    const seconds = dtToday.getSeconds();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    if (minutes >= 45) {
      hour++;
    }
    const date2 = new Date(this.confirmForm.get('refercaseVisitDate').value);
    date2.setHours(hour, minutes, 0, 0);
    date1.setHours(hour, minutes, 0, 0);
    if (date1.getTime() === date2.getTime()) {
      this.minTime = new Date();
      this.cd.markForCheck();
    } else {
      this.minTime = null;
      this.cd.markForCheck();
    }
    this.startAt = new Date
      (
        year, month - 1, day, hour,
        minutes >= 0 && minutes < 15 ? 15 :
          minutes >= 15 && minutes < 30 ? 30 :
            minutes >= 30 && minutes < 45 ? 45 :
              minutes >= 45 ? 0 : 15, seconds
      );
    this.confirmForm.get('refercaseVisitTime').patchValue('', { emitEvent: false });
    this.confirmForm.get('refercaseVisitTime').updateValueAndValidity({ emitEvent: false });
    this.cd.markForCheck();
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
    } else if (!this.convertedTime && this.editInput) {
      this.error = 'Please select time.';
      this.cd.markForCheck();
    } else if (!this.editInput && !this.confirmForm.get('refercaseVisitTime').value) {
      this.error = 'Please select time.';
      this.cd.markForCheck();
    } else {
      this.error = '';
      this.spinner.show();
      const data = {
        languageID: '1',
        refercaseID: this.refercaseID,
        facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
        newDate: this.confirmForm.get('refercaseVisitDate').value ? moment(this.confirmForm.get('refercaseVisitDate').value, 'YYYY-MM-DD').format('YYYY-MM-DD') : '',
        newTime: this.confirmForm.get('refercaseVisitTime').value ? moment(this.confirmForm.get('refercaseVisitTime').value, 'h:mm:ss A').format('HH:mm:ss') : '',
        doctorID: this.doctorID ? this.doctorID : '0'
      };
      this.facilityService.acceptReferral(JSON.stringify(data)).subscribe(
        (res) => {
          if (res[0].status === 'true') {
            setTimeout(() => {
              this.triggerEvent(JSON.stringify({
                res: 'confirmed',
                refercaseVisitDate: this.editInput ? this.confirmForm.get('refercaseVisitDate').value : this.refercaseVisitDate
              }));
              this.service.nextCountNotificationAndReferral(this.refercaseID);
              this.facilityService.forceReloadNotify();
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
  onTypeVisitDate = (value: string) => {
    let input = value;
    if (/\D\/$/.test(input)) { input = input.substr(0, input.length - 3); }
    const values = input.split('/').map((v) => v.replace(/\D/g, ''));
    if (values[0]) { values[0] = this.checkValue(values[0], 12); }
    if (values[1]) { values[1] = this.checkValue(values[1], 31); }
    const output = values.map((v, i) => v.length === 2 && i < 2 ? v + ' / ' : v);
    this.visitDate.nativeElement.value = output.join('').substr(0, 14);
  }
  onBlurVisitDate = (value: string) => {
    const input = value;
    const values = input.split('/').map((v) => v.replace(/\D/g, ''));
    let output = '';
    if (values.length === 3) {
      const year = values[2].length !== 4 ? +(values[2]) + new Date().getFullYear() : +(values[2]);
      const month = +(values[0]) - 1;
      const day = +(values[1]);
      const d = new Date(year, month, day);
      if (!isNaN(+d)) {
        document.getElementById('dov').innerText = d.toString();
        const dates = [d.getMonth() + 1, d.getDate(), d.getFullYear()];
        output = dates.map((v) => {
          v = v;
          return v.toString().length === 1 ? '0' + v : v;
        }).join(' / ');
      }
    }
    if (output) {
      this.visitDate.nativeElement.value = output.replace(/\s/g, '');
      this.confirmForm.get('refercaseVisitDate')
        .setValue(new Date(+output.split('/')[2], +output.split('/')[0] - 1, +output.split('/')[1]), { emitEvent: false });
      this.confirmForm.get('refercaseVisitDate').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
    if (!output) {
      this.visitDate.nativeElement.value = '';
      this.confirmForm.get('refercaseVisitDate').patchValue('', { emitEvent: false });
      this.confirmForm.get('refercaseVisitDate').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
  }
  checkValue = (str: string, max: number) => {
    if (str.charAt(0) !== '0' || str === '00') {
      let num = +str;
      if (isNaN(num) || num <= 0 || num > max) { num = 1; }
      str = num > +(max.toString().charAt(0)) && num.toString().length === 1 ? '0' + num : num.toString();
    }
    return str;
  }
  triggerEvent = (data: string) => {
    this.event.emit(data);
  }
}
