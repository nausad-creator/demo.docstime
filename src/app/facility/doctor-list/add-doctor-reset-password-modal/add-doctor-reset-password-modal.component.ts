import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmedValidator } from 'src/app/docs/change-password/confirmed';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-add-doctor-reset-password-modal',
  template: `<div class="modal-contents">
  <div class="modal-header">
    <h5 class="modal-title w-100 text-center" id="exampleModalLabel">Create Password</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="onClose()" #closebutton>
      <span aria-hidden="true">×</span></button>
  </div>
  <div class="modal-body">
       <!-- error handler -->
       <div class="alert alert-danger" role="alert" *ngIf="error">
        <h5 class="alert-heading text-center">Error!</h5>
        <p class="mb-0 text-center">{{error}}</p>
      </div>
      <!-- handler end -->
    <form class="text-left profile-form" [formGroup]="resetForm" (ngSubmit)="onReset(resetForm.value)">
      <div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" name="auto" [checked]="auto" (change)="onChangeRadio()" class="custom-control-input"
            id="customRadio1">
          <label class="custom-control-label cursr" for="customRadio1">Automatic</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" name="manual" [checked]="!auto" (change)="onChangeRadio()" class="custom-control-input"
            id="customRadio2">
          <label class="custom-control-label cursr" for="customRadio2">Manual</label>
        </div>
      </div>
      <br>

      <div class="auto" *ngIf="auto">
        <div class="col-12">
          <p class="text-center">An email with login details will be shared with the doctor.</p>
        </div>
        <br>
        <div class="p-3">
          <button type="submit" class="btn btn-primary btn-lg btn-block button-contactForm">Add Doctor</button>
        </div>
      </div>

      <div class="resetPass" *ngIf="!auto">
        <div class="form-group">
          <label for="NewPassword" class="text-uppercase text-primary">New Password<span
              class="required-field"></span></label>
          <div class="form-group inputWithIcon">
            <input type="password" [type]=" hide ? 'password' : 'text' " formControlName="newPassword"
              (keydown.space)="$event.preventDefault()" class="form-control" id="NewPassword" name="NewPassword"
              placeholder="Password" autocomplete="off">
            <a class="cursr" (click)="myFunction()"><i class="fas "
                [ngClass]="{'fa-eye': !hide, 'fa-eye-slash': hide}"></i></a>
            <small class="text-danger "
              *ngIf="resetForm.controls['newPassword'].hasError('required') && (resetForm.controls['newPassword'].dirty || resetForm.controls['newPassword'].touched)">Please
              enter new password</small>
            <small class="text-danger "
              *ngIf="resetForm.controls['newPassword'].hasError('pattern') && (resetForm.controls['newPassword'].dirty || resetForm.controls['newPassword'].touched)">Password
              needs to be at least eight characters, one uppercase letter and one number.</small>
          </div>
        </div>
        <div class="form-group">
          <label for="NewPassword" class="text-uppercase text-primary">Confirm New Password<span
              class="required-field"></span></label>
          <div class="form-group inputWithIcon">
            <input type="password" [type]=" confirm ? 'password' : 'text' " formControlName="reEnterNewPassword" class="form-control" id="NewPassword2"
            name="NewPassword" placeholder="Password" autocomplete="off">
            <a class="cursr" (click)="myConfirm()"><i class="fas "
              [ngClass]="{'fa-eye': !confirm, 'fa-eye-slash': confirm}"></i></a>
          <small class="text-danger "
            *ngIf="resetForm.controls['reEnterNewPassword'].hasError('required') && (resetForm.controls['reEnterNewPassword'].dirty || resetForm.controls['reEnterNewPassword'].touched)">Please
            enter Re-enter new password</small>
          <small class="text-danger "
            *ngIf="resetForm.controls['reEnterNewPassword'].hasError('confirmedValidator')">Re-enter Password is not
            match</small>
          </div>
        </div>
        <br>
        <div class="p-3">
          <button type="submit" class="btn btn-primary btn-lg btn-block button-contactForm">Add Doctor</button>
        </div>
      </div>

    </form>
  </div>
</div>`,
  styles: [`.small {
    font-size: 0.9em;
  }
  .inputWithIcon input [type="password"] {
    padding-right: 40px;
  }
  .inputWithIcon {
    position: relative;
  }
  .inputWithIcon i {
    position: absolute;
    right: 0px;
    top: 3px;
    padding: 9px 12px;
  }
  .cursr {
    cursor: pointer;
  }
  .required-field::before {
    content: "*";
    color: red;
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
}`],
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
