import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FacilityResetPasswordComponent } from '../facility-reset-password/facility-reset-password.component';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-facility-otp-verification',
  templateUrl: './facility-otp-verification.component.html',
  styleUrls: ['./facility-otp-verification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityOtpVerificationComponent implements OnInit {
  list: any[] = [];
  message: string;
  verificationForm: FormGroup;
  error: string;
  constructor(
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private bsModalRef: BsModalRef,
    private fb: FormBuilder
  ) {
    this.verificationForm = this.fb.group({
      otp: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
    });
  }

  ngOnInit(): void {
    this.message = `Please enter verification code which we have sent to your registered ${this.list[0].message}`;
  }

  openResetPasswordModal = (res: any) => {
    const initialState = {
      list: [{
        res,
      }]
    };
    this.bsModalRef = this.modalService.show(FacilityResetPasswordComponent, { id: 103, initialState });
  }
  onCloseVerification = () => {
    this.bsModalRef.hide();
  }

  onResendClick = () => {
    this.spinner.show();
    const json = {
      languageID: '1',
      facilityuserID: this.list[0].res[0].facilityuserID,
      facilityuserMobile: this.list[0].res[0].facilityuserMobile
    };
    this.service.facilityResendOTP(JSON.stringify(json)).subscribe((response) => {
      if (response[0].status === 'true') {
        this.verificationForm.reset();
        this.spinner.hide();
        this.toastr.success(response[0].message, 'success');
      } else {
        this.spinner.hide();
        this.error = response[0].message;
      }
    }, (error) => {
      this.spinner.hide();
      console.error(error);
    });
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
        facilityuserID: this.list[0].res[0].facilityuserID,
        facilityuserOTP: post.otp.toString()
      };
      this.submitOTP(JSON.stringify(json)).then((res) => {
        this.verificationForm.reset();
        this.modalService.hide(102);
        setTimeout(() => {
          this.spinner.hide();
          this.openResetPasswordModal(res[0].data);
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
      this.service.facilityOTP(post).subscribe((response) => {
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
