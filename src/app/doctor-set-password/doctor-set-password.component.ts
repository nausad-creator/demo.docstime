import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DoctorOtpVerificationComponent } from '../doctor-otp-verification/doctor-otp-verification.component';

@Component({
  selector: 'app-doctor-set-password',
  templateUrl: './doctor-set-password.component.html',
  styleUrls: ['./doctor-set-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorSetPasswordComponent implements OnInit {
  setPasswordForm: FormGroup;
  data = {
    doctorEmail: '',
    doctorMobile: '',
    doctorID: '',
    languageID: '1',
  };
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) {
    this.setPasswordForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)]),
      ],
    });
  }

  ngOnInit(): void {
  }
  onCloseModal = () => {
    this.bsModalRef.hide();
  }
  openVerificationModal = (res: any, message: string) => {
    const initialState = {
      list: [{
        res,
        message,
        status: 'forget'
      }]
    };
    this.spinner.hide();
    this.bsModalRef = this.modalService.show(DoctorOtpVerificationComponent, { id: 199, initialState });
  }
  onSubmitEmailOrMobile = (post: any) => {
    this.markFormTouched(this.setPasswordForm);
    if (this.setPasswordForm.valid) {
      this.spinner.show();
      if (!isNaN(post.email)) {
        (this.data.doctorMobile = post.email);
        this.data.doctorEmail = '';
        setTimeout(() => {
          this.modalService.hide(505);
        }, 2000);
        setTimeout(() => {
          this.openVerificationModal(this.data, 'Mobile numner');
          this.toastr.success('We have sent otp on your registered mobile.');
        }, 3000);
      } else {
        (this.data.doctorEmail = post.email);
        this.data.doctorMobile = '';
        setTimeout(() => {
          this.modalService.hide(505);
        }, 2000);
        setTimeout(() => {
          this.openVerificationModal(this.data, 'email address');
          this.toastr.success('We have sent otp on your registered email.');
        }, 3000);
      }
      this.cd.markForCheck();
    }
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
