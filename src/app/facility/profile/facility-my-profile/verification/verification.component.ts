import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FacilityService } from 'src/app/facility/facility.service';
interface ChangeVerify {
  facilityuserID: string;
  changeFacilityuserOTP: number;
}
@Component({
  selector: 'app-verification',
  template: `
  <div class="modal-contents modal">
  <!-- Modal Header -->
  <div class="modal-header">
    <h4 class="modal-title">Verification</h4>
    <button type="button" (click)="onCloseVerification()" class="close" data-dismiss="modal">&times;</button>
  </div>
  <!-- Modal body -->
  <div class="modal-body">
    <!-- error handler -->
    <div class="alert alert-danger" role="alert" *ngIf="error">
      <h5 class="alert-heading text-center">Error!</h5>
      <p class="mb-0 text-center">{{error}}</p>
    </div>
    <!-- handler end -->
    <form class="bootstrap-form needs-validation LoginForm" [formGroup]="verificationForm"
      (ngSubmit)="onSubmitOTP(verificationForm.value)" novalidate>
      <p *ngIf="message">{{message}}</p>
      <br><br>
      <div class="form-group">
        <label for="verification" class="text-uppercase text-primary">Verification<span class="required-field"></span></label>
        <input type="text" maxlength="4" (keydown.space)="$event.preventDefault()" formControlName="changeFacilityuserOTP" class="form-control" id="verification"
          name="verification" placeholder="Enter verification code">
        <small class="text-danger"
          *ngIf="verificationForm.controls['changeFacilityuserOTP'].hasError('required') && verificationForm.controls['changeFacilityuserOTP'].dirty">This
          field is required</small>
        <small class="text-danger" *ngIf="verificationForm.controls['changeFacilityuserOTP'].hasError('pattern')">Accept
          only
          numeric
          value.</small>
      </div>
      <a (click)="onResendClick()" style="color: blue; cursor: pointer; float: right; margin-right: 24px;"
        class="text-blue">Resend OTP</a>
      <br>
      <div class="p-3">
        <button type="submit" class="btn btn-primary btn-lg btn-block button-contactForm">Verify</button>
      </div>
    </form>
  </div>
</div>
  `,
  styles: [
    `.small {
      font-size: 0.9em;
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
  }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerificationComponent implements OnInit {
  list: any[] = [];
  message: string;
  verificationForm: FormGroup;
  error: string;
  public event: EventEmitter<string> = new EventEmitter();
  constructor(
    private spinner: NgxSpinnerService,
    private service: FacilityService,
    private toastr: ToastrService,
    private bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.verificationForm = this.fb.group({
      changeFacilityuserOTP: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
    });
  }

  ngOnInit(): void {
    this.message = `Please enter verification code which we have sent to your registered.`;
  }

  onCloseVerification = () => {
    this.bsModalRef.hide();
  }
  onResendClick = () => {
    this.spinner.show();
    this.service.checkForChange(JSON.stringify(this.list[0].res)).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.verificationForm.reset();
          this.spinner.hide();
          this.toastr.success(response[0].message);
        } else {
          this.spinner.hide();
          this.error = response[0].message;
          this.cd.markForCheck();
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
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
  onSubmitOTP = (post: ChangeVerify) => {
    this.markFormTouched(this.verificationForm);
    const invalidinput = this.findInvalidControls();
    if (this.verificationForm.valid && invalidinput.length === 0) {
      const json = {
        languageID: '1',
        facilityuserID: this.list[0].res.facilityuserID,
        changeFacilityuserOTP: post.changeFacilityuserOTP.toString()
      };
      this.submitOTP(JSON.stringify(json))
        .then(() => {
          this.triggerEvent(JSON.stringify({
            res: 'confirmed'
          }));
          this.verificationForm.reset();
          this.onCloseVerification();
        }).catch((error) => {
          this.toastr.success('Error occured');
          this.spinner.hide();
          this.error = error;
          this.cd.markForCheck();
        });
    }
  }
  submitOTP = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.service.changeVerification(post).subscribe((response) => {
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
  triggerEvent = (data: string) => {
    this.event.emit(data);
  }
}
