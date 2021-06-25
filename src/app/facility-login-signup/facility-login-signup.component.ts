import { Component, DoCheck, EventEmitter, KeyValueDiffers, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FacilityForgetPasswordComponent } from '../facility-forget-password/facility-forget-password.component';
import { FacilityService } from '../facility/facility.service';
import { HomeService } from '../home.service';
interface Doctor {
  cityID: string;
  degreeID: string;
  degreeName: string;
  doctorAbout: string;
  doctorAddress: string;
  doctorAdminPush: string;
  doctorAlternateEmail: string;
  doctorAppointmentPush: string;
  doctorApproved: string;
  doctorCreatedDate: string;
  doctorDOB: string;
  doctorDeviceID: string;
  doctorDeviceType: string;
  doctorEmail: string;
  doctorFax: string;
  doctorFirstName: string;
  doctorFullName: string;
  doctorGender: string;
  doctorID: string;
  doctorLastName: string;
  doctorLatitude: string;
  doctorLongitude: string;
  doctorMobile: string;
  doctorNPI: string;
  doctorOTP: string;
  doctorOTPVerified: string;
  doctorPassword: string;
  doctorPostalcode: string;
  doctorProfileImage: string;
  doctorRatingAvg: string;
  doctorRatingCount: string;
  doctorRatingPush: string;
  doctorReferredCasePush: string;
  doctorReviewCount: string;
  doctorStatus: string;
  doctorbadgeCount: string;
  facilityID: string;
  facilityIDs: string;
  facilityName: string;
  facilityTzID: string;
  hospitalID: string;
  refmessage: string;
  specialityIDs: string;
  stateID: string;
  tzID: string;
}
@Component({
  selector: 'app-facility-login-signup',
  templateUrl: './facility-login-signup.component.html',
  styleUrls: ['./facility-login-signup.component.css']
})
export class FacilityLoginSignupComponent implements OnInit, DoCheck {
  logIn: FormGroup;
  joinUs: FormGroup;
  modalRef: BsModalRef;
  error: string;
  hide = true;
  login = true;
  differ: any;
  event: EventEmitter<{ data: string, res: number }> = new EventEmitter();
  constructor(
    private service: HomeService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private facilityService: FacilityService,
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private diff: KeyValueDiffers,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.logIn = this.fb.group({
      facilityuserEmail: ['', Validators.compose([Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      facilityuserPassword: [''],
      languageID: ['1'],
      terms: [false],
    });
    // join-us form
    this.joinUs = this.fb.group({
      requestFacilityName: ['', Validators.compose([Validators.maxLength(40), Validators.pattern('^[a-zA-Z \-\']+')])],
      requestFacilityEmail: ['', Validators.compose([Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      requestFacilityMobile: ['', Validators.compose([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')])],
      requestFacilityZip: ['', Validators.compose([Validators.pattern('^((\\+91-?)|0)?[0-9]{5}$')])],
      requestFacilityFax: ['', Validators.compose([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')])],
      facilityuserID: ['0'],
      languageID: ['1'],
      termsAndPrivacy: [true],
      hippa: [true],
    });
    // differ
    this.differ = this.diff.find({}).create();
  }
  ngOnInit(): void {
  }
  closeModal = (modalId?: number) => {
    this.modalService.hide(modalId);
  }
  myFunction = () => {
    this.hide = !this.hide;
  }
  ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'login') {
          this.reset();
        }
      });
    }
  }
  reset = () => {
    this.error = '';
    this.clearControlLogin();
    this.clearControlJoin();
    this.joinUs.get('termsAndPrivacy').patchValue(true);
    this.joinUs.get('hippa').patchValue(true);
  }
  onClickLogin = (post: {
    facilityuserEmail: string;
    facilityuserPassword: string;
    terms: boolean;
  }) => {
    if (!this.checkControlPost(post)) {
      this.markFormTouched(this.logIn);
      if (this.logIn.valid && this.findInvalidControlsLogin().length === 0) {
        this.error = '';
        this.spinner.show();
        this.facilityLogin(JSON.stringify(post)).then((success: Doctor[]) => {
          this.facilityService.unSubscribe();
          this.bsModalRef.hide();
          if (post.terms === true) {
            this.service.setFaLocal(JSON.stringify(success[0]));
            this.service.removeFaSession();
          } else {
            this.service.setFaSession(JSON.stringify(success[0]));
            this.service.removeFaLocal();
          }
          this.error = '';
          this.spinner.hide();
          setTimeout(() => {
            this.logIn.reset();
            this.triggerEvent('Confirmed');
          }, 100);
        }).catch((error: string) => {
          this.spinner.hide();
          this.error = error;
          this.triggerEvent('Error');
        });
      } else { this.logIn.controls.terms.setValue(false); }
    }
    if (this.checkControlPost(post)) {
      this.markFormTouched(this.logIn);
    }
  }
  facilityLogin = (post: string) => {
    return new Promise((resolve, reject) => {
      this.service.facilitySignIn(post).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response[0].data);
        } else {
          reject('Invalid username and password.');
        }
      }, () => {
        reject('some error occured.');
      }
      );
    });
  }
  checkControlPost = (post: {
    facilityuserEmail: string;
    facilityuserPassword: string;
    terms: boolean;
  }) => {
    let invalid = false;
    Object.keys(post).forEach((key: string) => {
      if (key === 'facilityuserEmail' && !this.logIn.get(`${key}`).value) {
        this.logIn.get(`${key}`).setValidators([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)]);
        this.logIn.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'facilityuserPassword' && !this.logIn.get(`${key}`).value) {
        this.logIn.get(`${key}`).setValidators([Validators.required]);
        this.logIn.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
    });
    return invalid;
  }
  clearControlLogin = () => {
    Object.keys(this.logIn.value).forEach((key: string) => {
      if (key === 'facilityuserEmail') {
        this.logIn.get(`${key}`).patchValue('');
        if (this.logIn.get(`${key}`).validator) {
          const validator = this.logIn.get(`${key}`).validator({} as AbstractControl);
          if (validator && validator.required) {
            this.logIn.get(`${key}`).clearValidators();
            this.logIn.get(`${key}`).updateValueAndValidity({ onlySelf: true });
          }
        }
      }
      if (key === 'facilityuserPassword') {
        this.logIn.get(`${key}`).patchValue('');
        if (this.logIn.get(`${key}`).validator) {
          const validator = this.logIn.get(`${key}`).validator({} as AbstractControl);
          if (validator && validator.required) {
            this.logIn.get(`${key}`).clearValidators();
            this.logIn.get(`${key}`).updateValueAndValidity({ onlySelf: true });
          }
        }
      }
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
  triggerEvent = (item: string) => {
    this.event.emit({ data: item, res: 200 });
  }
  openForgetModal = () => {
    this.bsModalRef = this.modalService.show(FacilityForgetPasswordComponent, { id: 101 });
  }
  onJoinUS = (post: {
    requestFacilityName: string;
    requestFacilityEmail: string;
    requestFacilityMobile: string;
    requestFacilityZip: string;
    requestFacilityFax: string;
    termsAndPrivacy: boolean;
    hippa: boolean;
  }) => {
    if (!this.checkControlPostJoin(post)) {
      this.markFormTouched(this.joinUs);
      if (this.joinUs.valid && this.findInvalidControlsJoinUS().length === 0) {
        this.join(JSON.stringify(post)).then(() => {
          setTimeout(() => {
            this.spinner.hide();
            this.toastr.success('<h5>Thank you for contacting DocsTime.</h5>We will get back to you within 24 hrs.'
              , '', {
              positionClass: 'toast-center-center-join-us',
              timeOut: 5000,
              enableHtml: true,
            });
            setTimeout(() => {
              this.joinUs.reset();
              this.bsModalRef.hide();
            }, 500);
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            this.spinner.hide();
            this.toastr.error('Some error occured, please try again later', 'Error');
          }, 500);
        });
      }
    }
    if (this.checkControlPostJoin(post)) {
      this.markFormTouched(this.joinUs);
    }
  }
  checkControlPostJoin = (post: {
    requestFacilityName: string;
    requestFacilityEmail: string;
    requestFacilityMobile: string;
    requestFacilityZip: string;
    requestFacilityFax: string;
    termsAndPrivacy: boolean;
    hippa: boolean;
  }) => {
    let invalid = false;
    Object.keys(post).forEach((key: string) => {
      if (key === 'requestFacilityName' && !this.joinUs.get(`${key}`).value) {
        this.joinUs.get(`${key}`).setValidators([Validators.required, Validators.maxLength(40), Validators.pattern('^[a-zA-Z \-\']+')]);
        this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'requestFacilityEmail' && !this.joinUs.get(`${key}`).value) {
        this.joinUs.get(`${key}`).setValidators([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
        this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'requestFacilityMobile' && !this.joinUs.get(`${key}`).value) {
        this.joinUs.get(`${key}`).setValidators([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
        this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'requestFacilityZip' && !this.joinUs.get(`${key}`).value) {
        this.joinUs.get(`${key}`).setValidators([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{5}$')]);
        this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'termsAndPrivacy' && !this.joinUs.get(`${key}`).value) {
        this.joinUs.get(`termsAndPrivacy`).patchValue('');
        this.joinUs.get(`${key}`).setValidators([Validators.required]);
        this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'hippa' && !this.joinUs.get(`${key}`).value) {
        this.joinUs.get(`hippa`).patchValue('');
        this.joinUs.get(`${key}`).setValidators([Validators.required]);
        this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
    });
    return invalid;
  }
  clearControlJoin = () => {
    Object.keys(this.joinUs.value).forEach((key: string) => {
      if (key === 'requestFacilityName') {
        this.joinUs.get(`${key}`).patchValue('');
        if (this.joinUs.get(`${key}`).validator) {
          const validator = this.joinUs.get(`${key}`).validator({} as AbstractControl);
          if (validator && validator.required) {
            this.joinUs.get(`${key}`).clearValidators();
            this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
          }
        }
      }
      if (key === 'requestFacilityEmail') {
        this.joinUs.get(`${key}`).patchValue('');
        if (this.joinUs.get(`${key}`).validator) {
          const validator = this.joinUs.get(`${key}`).validator({} as AbstractControl);
          if (validator && validator.required) {
            this.joinUs.get(`${key}`).clearValidators();
            this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
          }
        }
      }
      if (key === 'requestFacilityMobile') {
        this.joinUs.get(`${key}`).patchValue('');
        if (this.joinUs.get(`${key}`).validator) {
          const validator = this.joinUs.get(`${key}`).validator({} as AbstractControl);
          if (validator && validator.required) {
            this.joinUs.get(`${key}`).clearValidators();
            this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
          }
        }
      }
      if (key === 'requestFacilityZip') {
        this.joinUs.get(`${key}`).patchValue('');
        if (this.joinUs.get(`${key}`).validator) {
          const validator = this.joinUs.get(`${key}`).validator({} as AbstractControl);
          if (validator && validator.required) {
            this.joinUs.get(`${key}`).clearValidators();
            this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
          }
        }
      }
      if (key === 'requestFacilityFax') {
        this.joinUs.get(`${key}`).patchValue('');
        if (this.joinUs.get(`${key}`).validator) {
          const validator = this.joinUs.get(`${key}`).validator({} as AbstractControl);
          if (validator && validator.required) {
            this.joinUs.get(`${key}`).clearValidators();
            this.joinUs.get(`${key}`).updateValueAndValidity({ onlySelf: true });
          }
        }
      }
    });
  }
  join = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.service.facilityJoin(post).subscribe((res => res[0].status === 'true' ? resolve(res[0].message) :
        reject('error occured')), err => reject(err));
    });
  }
  findInvalidControlsJoinUS = () => {
    const invalid = [];
    const controls = this.joinUs.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  findInvalidControlsLogin = () => {
    const invalid = [];
    const controls = this.logIn.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  onNavigateTerms = () => {
    this.router.navigate(['/content/terms-and-conditions']);
  }
  onNavigatePolicy = () => {
    this.router.navigate(['/content/privacy-policy']);
  }
}
