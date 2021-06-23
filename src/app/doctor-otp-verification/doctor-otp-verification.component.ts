import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DoctorResetPasswordComponent } from '../doctor-reset-password/doctor-reset-password.component';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-doctor-otp-verification',
  templateUrl: './doctor-otp-verification.component.html',
  styleUrls: ['./doctor-otp-verification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorOtpVerificationComponent implements OnInit {
  list: any[] = [];
  message: string;
  verificationForm: FormGroup;
  error: string;
  status: string;
  constructor(
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.verificationForm = this.fb.group({
      otp: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
    });
  }
  ngOnInit(): void {
    this.status = `${this.list[0].status}`;
    this.message = `Please enter verification code which we have sent to your registered ${this.list[0].message}`;
  }
  openResetPasswordModal = (res: any) => {
    const initialState = {
      list: [{
        res,
      }]
    };
    this.bsModalRef = this.modalService.show(DoctorResetPasswordComponent, { id: 198, initialState });
  }
  onCloseVerification = () => {
    this.bsModalRef.hide();
  }
  onResendClick = () => {
    this.spinner.show();
    const json = {
      languageID: '1',
      logindoctorID: this.list[0].res.doctorID ? this.list[0].res.doctorID : '',
      doctorEmailMobile: this.list[0].res.doctorMobile ? this.list[0].res.doctorMobile.match(/\d/g).join('') : this.list[0].res.doctorEmail
    };
    this.service.doctorResendOTP(JSON.stringify(json)).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.verificationForm.reset();
          this.spinner.hide();
          this.toastr.success(response[0].message);
        } else {
          this.spinner.hide();
          this.error = response[0].message;
          this.cd.markForCheck();
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }
  findInvalidControls = () => {
    const invalid = [];
    const controls = this.verificationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  onSubmitOTP = (post: any) => {
    this.markFormTouched(this.verificationForm);
    const invalidinput = this.findInvalidControls();
    if (this.verificationForm.valid && invalidinput.length === 0) {
      const json = {
        languageID: '1',
        logindoctorID: this.list[0].res.doctorID ? this.list[0].res.doctorID : '',
        doctorOTP: post.otp.toString(),
        doctorEmailMobile: this.list[0].res.doctorMobile ? this.list[0].res.doctorMobile.match(/\d/g).join('') : this.list[0].res.doctorEmail,
        facilityID: this.list[0].res.facilityID ? this.list[0].res.facilityID : ''
      };
      this.submitOTP(JSON.stringify(json)).then((res) => {
        this.verificationForm.reset();
        this.onCloseVerification();
        setTimeout(() => {
          this.spinner.hide();
          this.status === 'forget' ? this.openResetPasswordModal(res[0].data) :
            this.status === 'facilityAddDoctor' ? this.service.updateDoctorLists(true) : this.onCloseVerification();
        }, 500);
      }).catch((error) => {
        this.spinner.hide();
        this.error = error;
        this.cd.markForCheck();
      });
    }
  }
  submitOTP = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.service.doctorOTP(post).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response);
        } else {
          reject(response[0].message);
        }
      }, () => reject('Some error occured, please try again later'));
    });
  }
  markFormTouched = (group: FormGroup | FormArray) => {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        control.markAsTouched();
        this.markFormTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
