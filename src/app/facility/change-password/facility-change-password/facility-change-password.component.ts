import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordFacility } from 'src/app/docs';
import { ConfirmedValidator } from 'src/app/docs/change-password/confirmed';
import { ConfirmedValidatorForSameOldAndCurrentPassword } from 'src/app/docs/change-password/unconfirmed';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../../facility.service';

@Component({
  selector: 'app-facility-change-password',
  template: `
  <body class="dashbord-section">
    <div class="spacetop"></div>
    <section class="section-dashbord">
      <div class="container">
        <div class="">
          <div class="title-dashbord d-flex pt-3">
            <h4 class="text-dark mb-0">Change Password</h4>
          </div>
          <div class="appointment-conten pt-3">
            <div class="">
              <form class="text-left profile-form" [formGroup]="changePassword">
                <div class="row">
                  <div class="col-lg-7 col-md-12 align-self-center">
                    <div class="card p-3">
                      <div class="form-row">
                        <div class="col-xl-12">
                          <label for="password">Current Password<span class="required-field"></span></label>
                          <div class="form-group inputWithIcon">
                            <input type="password" [type]=" current ? 'password' : 'text'" name="password" class="form-control" formControlName="currentPassword"
                            id="password" (keydown.space)="$event.preventDefault()" placeholder="Enter current password" data-rule="minlen:4" required="">
                            <a class="cursr" (click)="onClickCurrent()"><i class="fas "
                              [ngClass]="{'fa-eye': !current, 'fa-eye-slash': current}"></i></a>
                          <small class="text-danger"
                            *ngIf="changePassword.controls['currentPassword'].hasError('required') && (changePassword.controls['currentPassword'].dirty || changePassword.controls['currentPassword'].touched)">Please
                            enter current password.</small>
                          </div>
                        </div>
                        <div class="col-xl-12">
                          <label for="NewPassword">New Password<span class="required-field"></span></label>
                          <div class="form-group inputWithIcon">
                            <input type="password" [type]=" new ? 'password' : 'text'" formControlName="newPassword"
                            (keydown.space)="$event.preventDefault()" name="NewPassword" class="form-control"
                            id="NewPassword" placeholder="Enter Password" data-rule="minlen:4" required="">
                          <a class="cursr" (click)="onClickNew()"><i class="fas "
                              [ngClass]="{'fa-eye': !new, 'fa-eye-slash': new}"></i></a>
                          <small class="text-danger"
                            *ngIf="changePassword.controls['newPassword'].hasError('required') && (changePassword.controls['newPassword'].dirty || changePassword.controls['newPassword'].touched)">Please
                            enter new password.</small>
                          <small class="text-danger"
                            *ngIf="changePassword.controls['newPassword'].hasError('confirmedValidatorOldAndCurrent')">New
                            password and current password should not be same.</small>
                            <small class="text-danger"
                            *ngIf="changePassword.controls['newPassword'].hasError('pattern') && (changePassword.controls['newPassword'].dirty || changePassword.controls['newPassword'].touched)">Password
                        needs to be at least eight characters, one uppercase letter and one number.</small>
                          </div>
                          <div class="invalid-feedback">Please enter at least 4 chars</div>
                        </div>
                        <div class="col-xl-12">
                          <label for="ConNewPassword">Confirm New Password<span class="required-field"></span></label>
                          <div class="form-group inputWithIcon">
                            <input type="password" [type]=" confirm ? 'password' : 'text'" formControlName="reEnterNewPassword" name="ConNewPassword"
                            class="form-control" (keydown.space)="$event.preventDefault()" id="ConNewPassword" placeholder="Re-enter new password" data-rule="minlen:4"
                            required="">
                            <a class="cursr" (click)="onClickConfirm()"><i class="fas "
                              [ngClass]="{'fa-eye': !confirm, 'fa-eye-slash': confirm}"></i></a>
                          <small class="text-danger"
                            *ngIf="changePassword.controls['reEnterNewPassword'].hasError('required') && (changePassword.controls['reEnterNewPassword'].dirty || changePassword.controls['reEnterNewPassword'].touched)">Please
                            enter Re enter new password.</small>
                          <small class="text-danger"
                            *ngIf="changePassword.controls['reEnterNewPassword'].hasError('confirmedValidator')">Re enter
                            new password is not match.</small>
                          </div>
                          <div class="invalid-feedback">Please enter at least 4 chars</div>
                        </div>
                      </div>
                      <div class="regerv_btn" style="padding-top: 10px;"><a (click)="passwordUpdate(changePassword.value)" style="cursor: pointer;"
                          class="btn btn-primary">Update</a>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    <br>
  </body>
  `,
  styles: [`
  .small {
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
  }`]
})
export class FacilityChangePasswordComponent implements OnInit {
  changePassword: FormGroup;
  new = true;
  current = true;
  confirm = true;
  constructor(
    private fb: FormBuilder,
    private facilityService: FacilityService,
    private service: HomeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    // tslint:disable-next-line: deprecation
    this.changePassword = this.fb.group(
      {
        currentPassword: ['', Validators.compose([Validators.required]),
        ],
        newPassword: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)]),
        ],
        reEnterNewPassword: [null, Validators.compose([Validators.required]),
        ],
      },
      {
        validators: [
          ConfirmedValidator('newPassword', 'reEnterNewPassword'),
          ConfirmedValidatorForSameOldAndCurrentPassword('currentPassword', 'newPassword'),
        ],
      }
    );
  }

  ngOnInit(): void {
  }

  onClickNew = () => {
    this.new = !this.new;
  }
  onClickCurrent = () => {
    this.current = !this.current;
  }
  onClickConfirm = () => {
    this.confirm = !this.confirm;
  }

  passwordUpdate = (post: any) => {
    this.markFormTouched(this.changePassword);
    if (this.changePassword.valid) {
      this.spinner.show();
      const data: ChangePasswordFacility = {
        facilityuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID : this.service.getFaSession().facilityuserID,
        facilityuserCurrentPassword: post.currentPassword,
        languageID: '1',
        facilityNewPassword: post.newPassword
      };
      this.facilityService.facChangePassword(JSON.stringify(data)).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.toastr.success(response[0].message);
              this.logOut();
            }, 500);
          } else {
            this.spinner.hide();
            this.toastr.error(response[0].message);
          }
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error('some error occured');
          console.error(error);
        }
      );
    }
  }
  logOut = () => {
    this.service.getFaLocal() ? this.service.removeFaLocal() : this.service.removeFaSession();
    this.facilityService.unSubscribe();
    this.facilityService.unSubs();
    this.service.unSubscribe();
    if (window.sessionStorage){
      sessionStorage.clear();
    }
    this.spinner.hide();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }
  markFormTouched(group: FormGroup | FormArray): any {
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
