import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FacilityOtpVerificationComponent } from '../facility-otp-verification/facility-otp-verification.component';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-facility-forget-password',
  templateUrl: './facility-forget-password.component.html',
  styleUrls: ['./facility-forget-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  public data = {
    facilityuserEmail: '',
    facilityuserMobile: '',
    facilityuserPassword: '',
    languageID: '1',
  };
  error: string;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private bsModalRef: BsModalRef
  ) {
    this.forgetForm = this.fb.group({
      email: [
        null,
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

  onCloseForgetModal = () => {
    this.bsModalRef.hide();
  }
  openVerificationModal = (res: any, message: string) => {
    const initialState = {
      list: [{
        res,
        message
      }]
    };
    this.bsModalRef = this.modalService.show(FacilityOtpVerificationComponent, { id: 102, initialState });
  }
  onSubmitEmailOrMobile = (post: any) => {
    this.markFormTouched(this.forgetForm);
    if (this.forgetForm.valid) {
      if (!isNaN(post.email)) {
        (this.data.facilityuserMobile = post.email);
        this.data.facilityuserEmail = '';
        this.forgetPassword(JSON.stringify(this.data)).then((res) => {
          this.forgetForm.reset();
          this.modalService.hide(101);
          setTimeout(() => {
            this.spinner.hide();
            this.openVerificationModal(res[0].data, 'Mobile numner');
            this.toastr.success('We have sent otp on your registered mobile.');
          }, 500);
        }).catch((error) => {
          this.spinner.hide();
          this.error = error;
          this.cd.markForCheck();
        });
      } else {
        (this.data.facilityuserEmail = post.email);
        this.data.facilityuserMobile = '';
        this.forgetPassword(JSON.stringify(this.data)).then((res) => {
          this.forgetForm.reset();
          this.modalService.hide(101);
          setTimeout(() => {
            this.spinner.hide();
            this.openVerificationModal(res[0].data, 'email address');
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
      this.service.facilityForPassword(data).subscribe((response) => {
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
