import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePassword } from 'src/app/docs';
import { ConfirmedValidator } from './confirmed';
import { ConfirmedValidatorForSameOldAndCurrentPassword } from './unconfirmed';
import { DocsService } from '../docs.service';
import { HomeService } from 'src/app/home.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePassword: FormGroup;
  docData: any;
  new = true;
  current = true;
  confirm = true;
  constructor(
    private fb: FormBuilder,
    private docService: DocsService,
    private service: HomeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.changePassword = this.fb.group(
      {
        currentPassword: ['', Validators.compose([Validators.required]),
        ],
        newPassword: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/), ]),
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
    this.docData = this.service.getDocLocal() ? this.service.getDocLocal() : this.service.getDocSession();
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
      const data: ChangePassword = {
        logindoctorID: this.docData.doctorID,
        doctorCurrentPassword: post.currentPassword,
        languageID: '1',
        doctorNewPassword: post.newPassword
      };
      this.docService.docChangePassword(JSON.stringify(data)).subscribe(
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
    this.service.getDocLocal() ? this.service.removeLocal() : this.service.removeSession();
    this.docService.unSubscribe();
    this.docService.unSubs();
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
