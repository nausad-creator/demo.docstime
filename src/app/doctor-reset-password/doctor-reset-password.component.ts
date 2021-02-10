import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmedValidator } from '../docs/change-password/confirmed';
import { DocsService } from '../docs/docs.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-doctor-reset-password',
  templateUrl: './doctor-reset-password.component.html',
  styleUrls: ['./doctor-reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorResetPasswordComponent implements OnInit {
  list: any[] = [];
  resetForm: FormGroup;
  error: string;
  new = true;
  confirm = true;
  constructor(
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private toastr: ToastrService,
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private router: Router,
    private docService: DocsService,
    private cd: ChangeDetectorRef
  ) {
    // tslint:disable-next-line: deprecation
    this.resetForm = this.fb.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)])],
      reEnterNewPassword: ['', Validators.compose([Validators.required])],
    },
      {
        validator: ConfirmedValidator('newPassword', 'reEnterNewPassword'),
      }
    );
  }

  ngOnInit(): void {
  }
  newPassword = () => {
    this.new = !this.new;
  }
  confirmPassword = () => {
    this.confirm = !this.confirm;
  }
  onCloseVerification = () => {
    this.bsModalRef.hide();
  }
  onReset = (post: any) => {
    this.markFormTouched(this.resetForm);
    const invalidInputs = this.findInvalidControls();
    if (this.resetForm.valid && invalidInputs.length === 0) {
      const json = {
        logindoctorID: this.list[0].res[0].doctorID,
        doctorNewPassword: post.newPassword,
        languageID: '1',
      };
      this.reset(JSON.stringify(json)).then((data: Array<any>) => {
        if (data.length > 0) {
          this.docService.unSubscribe();
          this.resetForm.reset();
          this.service.setDocSession(JSON.stringify(data[0]));
          this.service.removeLocal();
          this.bsModalRef.hide();
          setTimeout(() => {
            this.spinner.hide();
            this.toastr.success('Password updated successfully');
            this.router.navigate(['/doctor/dashboard']);
          }, 500);
        } else {
          this.error = 'error occured, please try again later.';
          this.spinner.hide();
          this.cd.markForCheck();
        }
      }).catch((error) => {
        this.error = error;
        this.spinner.hide();
        this.cd.markForCheck();
        console.error(error);
      });
    }
  }
  reset = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.service.doctorResPassword(post).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response[0].data);
        } else {
          reject(response[0].message);
        }
      }, () => reject('Some error occured, please try again later'));
    });
  }
  findInvalidControls = () => {
    const invalid = [];
    const controls = this.resetForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
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
