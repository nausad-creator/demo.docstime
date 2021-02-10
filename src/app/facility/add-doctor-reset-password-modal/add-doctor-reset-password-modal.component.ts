import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmedValidator } from 'src/app/docs/change-password/confirmed';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-add-doctor-reset-password-modal',
  templateUrl: './add-doctor-reset-password-modal.component.html',
  styleUrls: ['./add-doctor-reset-password-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDoctorResetPasswordModalComponent implements OnInit {
  list: any[] = [];
  resetForm: FormGroup;
  error: string;
  hide = true;
  confirm = true;
  auto = true;
  event: EventEmitter<any> = new EventEmitter();
  constructor(
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private bModalRef: BsModalRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    // tslint:disable-next-line: deprecation
    this.resetForm = this.fb.group(
      {
        newPassword: [''],
        reEnterNewPassword: [''],
      }, { validator: ConfirmedValidator('newPassword', 'reEnterNewPassword') });
  }

  ngOnInit(): void {
  }
  myFunction = () => {
    this.hide = !this.hide;
  }
  myConfirm = () => {
    this.confirm = !this.confirm;
  }
  onClose = () => {
    this.bModalRef.hide();
  }
  onChangeRadio = () => {
    this.auto = !this.auto;
    if (this.auto) {
      this.resetForm.reset();
      this.resetForm.get('newPassword').clearValidators();
      this.resetForm.get('reEnterNewPassword').clearValidators();
      this.resetForm.get('newPassword').updateValueAndValidity();
      this.resetForm.get('reEnterNewPassword').updateValueAndValidity();
    }
    if (!this.auto) {
      this.resetForm.reset();
      this.resetForm.get('newPassword').setValidators(Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)]));
      this.resetForm.get('reEnterNewPassword').setValidators(Validators.compose([Validators.required]));
      this.resetForm.get('reEnterNewPassword').validator(ConfirmedValidator('newPassword', 'reEnterNewPassword'));
      this.resetForm.get('newPassword').updateValueAndValidity();
      this.resetForm.get('reEnterNewPassword').updateValueAndValidity();
    }
  }
  onReset = (post: any) => {
    this.markFormTouched(this.resetForm);
    const invalidInputs = this.findInvalidControls();
    if (this.resetForm.valid && invalidInputs.length === 0) {
      if (this.auto) {
        this.spinner.show();
        setTimeout(() => {
          this.service.updateDoctorLists(true);
          this.bModalRef.hide();
          this.spinner.hide();
          this.toastr.success('Doctor added successfully');
        }, 1000);
      } else {
        const json = {
          logindoctorID: this.list[0].doctorID,
          doctorNewPassword: post.newPassword ? post.newPassword : '',
          languageID: '1',
        };
        this.reset(JSON.stringify(json)).then((data: Array<any>) => {
          if (data.length > 0) {
            this.resetForm.reset();
            this.bModalRef.hide();
            setTimeout(() => {
              this.service.updateDoctorLists(true);
              this.spinner.hide();
              this.toastr.success('Doctor added successfully');
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
