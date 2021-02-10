import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DoctorOtpVerificationComponent } from '../doctor-otp-verification/doctor-otp-verification.component';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-doctor-forget-password',
  templateUrl: './doctor-forget-password.component.html',
  styleUrls: ['./doctor-forget-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  data = {
    doctorEmail: '',
    doctorMobile: '',
    languageID: '1',
  };
  error: string;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) {
    this.forgetForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/
          ),
        ]),
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
    this.markFormTouched(this.forgetForm);
    if (this.forgetForm.valid) {
      if (!isNaN(post.email)) {
        (this.data.doctorMobile = post.email);
        this.data.doctorEmail = '';
        this.forgetPassword(JSON.stringify(this.data)).then((res) => {
          this.forgetForm.reset();
          this.modalService.hide(509);
          setTimeout(() => {
            this.spinner.hide();
            this.openVerificationModal(res[0].data[0], 'Mobile number');
            this.toastr.success('We have sent otp on your registered mobile.');
          }, 500);
        }).catch((error) => {
          this.spinner.hide();
          this.error = error;
          this.cd.markForCheck();
        });
      } else {
        (this.data.doctorEmail = post.email);
        this.data.doctorMobile = '';
        this.forgetPassword(JSON.stringify(this.data)).then((res) => {
          this.forgetForm.reset();
          this.modalService.hide(509);
          setTimeout(() => {
            this.spinner.hide();
            this.openVerificationModal(res[0].data[0], 'email address');
            this.toastr.success('We have sent otp on your registered email.');
          }, 500);
        }).catch((error) => {
          this.spinner.hide();
          this.error = error;
          this.cd.markForCheck();
        });
      }
    }
  }
  forgetPassword = (data: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.service.doctorForPassword(data).subscribe((response) => {
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
