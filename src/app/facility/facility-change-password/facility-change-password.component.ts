import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordFacility } from 'src/app/docs';
import { ConfirmedValidator } from 'src/app/docs/change-password/confirmed';
import { ConfirmedValidatorForSameOldAndCurrentPassword } from 'src/app/docs/change-password/unconfirmed';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';

@Component({
  selector: 'app-facility-change-password',
  templateUrl: './facility-change-password.component.html',
  styleUrls: ['./facility-change-password.component.css']
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
      this.router.navigate(['/home']);
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
