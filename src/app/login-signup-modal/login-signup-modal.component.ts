import { Component, DoCheck, EventEmitter, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReCaptcha2Component } from 'ngx-captcha';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocsService } from '../docs/docs.service';
import { DoctorForgetPasswordComponent } from '../doctor-forget-password/doctor-forget-password.component';
import { DoctorSetPasswordComponent } from '../doctor-set-password/doctor-set-password.component';
import { HomeService } from '../home.service';
import { SignupDocComponent } from '../signup-doc/signup-doc.component';
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
interface Record {
  addresses: {
    address_1: string;
    address_2: string;
    address_purpose: string;
    address_type: string;
    city: string;
    country_code: string;
    country_name: string;
    fax_number: string;
    fax_number_copy: string[]
    postal_code: string;
    state: string;
    telephone_number: string;
  }[];
  basic: {
    credential: string;
    enumeration_date: string;
    first_name: string;
    gender: string;
    last_name: string;
    last_updated: string;
    middle_name: string;
    name: string;
    name_prefix: string;
    sole_proprietor: string;
    status: string;
  };
  created_epoch: number;
  enumeration_type: string;
  identifiers: [];
  last_updated_epoch: number;
  number: number;
  other_names: [];
  taxonomies: {
    code: string;
    desc: string;
    license: string;
    primary: boolean;
    state: string;
  }[];
}
@Component({
  selector: 'app-login-signup-modal',
  templateUrl: './login-signup-modal.component.html',
  styleUrls: ['./login-signup-modal.component.css']
})
export class LoginSignupModalComponent implements OnInit, DoCheck {
  logIn: FormGroup;
  npiForm: FormGroup;
  error: string;
  differ: any;
  alreadyExistNpi: string;
  hide = true;
  login = true;
  siteKey = '6Lf9ZuQZAAAAAC4qh2Wzdhfb_jr9tuWxip39U8WO';
  size = 'Normal';
  theme = 'Light';
  type = 'Image';
  lang = 'en';
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  event: EventEmitter<{ data: string, res: number }> = new EventEmitter();
  constructor(
    private service: HomeService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private docService: DocsService,
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private router: Router,
    private diff: KeyValueDiffers
  ) {
    // for Login
    this.logIn = this.fb.group({
      doctorMobile: ['', Validators.compose([Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      doctorPassword: [''],
      languageID: ['1'],
      terms: [false],
    });
    // for NPI
    this.npiForm = this.fb.group({
      npiNumber: ['', Validators.compose([Validators.pattern('^[0-9]{10}$')])],
      mobileNumber: ['', Validators.compose([Validators.pattern('^[0-9]{10}$')])],
      recaptcha: [''],
      loginuserID: ['0'],
      facilityID: ['0'],
      languageID: ['1']
    });
    // differ
    this.differ = this.diff.find({}).create();
  }

  ngOnInit(): void {
  }
  myFunction = () => {
    this.hide = !this.hide;
  }
  ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'login') {
          this.login ? this.resetLogin() : this.resetNPI();
        }
      });
    }
  }
  resetLogin = () => {
    this.error = '';
    this.alreadyExistNpi = '';
    this.clearControlLogin();
  }
  resetNPI = () => {
    this.error = '';
    this.alreadyExistNpi = '';
    this.clearControlNPI();
    this.captchaElem.resetCaptcha();
  }
  navigateToContactUsFromPopUp = () => {
    this.router.navigate(['/content/contact-us']);
  }
  navigateToContactUsOnNPIenquery = () => {
    this.router.navigate(['/content/contact-us'], { queryParams: { p: `user_npi_issue` } });
  }
  openSetPassModal = () => {
    this.bsModalRef = this.modalService.show(DoctorSetPasswordComponent, { id: 505 });
  }
  openForgotPassModal = () => {
    this.bsModalRef = this.modalService.show(DoctorForgetPasswordComponent, { id: 509 });
  }
  closeModal = (modalId?: number) => {
    this.modalService.hide(modalId);
  }

  openSignUp = (post: { results: Record[] }, mobileNumber?: string) => {
    const initialState = {
      list: [{
        fullName: `${post.results[0].basic.first_name} ${post.results[0].basic.last_name}`,
        first_name: `${post.results[0].basic.first_name}`,
        last_name: `${post.results[0].basic.last_name}`,
        contact: mobileNumber ? mobileNumber : post.results[0].addresses[0].telephone_number.split('-').join(''),
        address: `${post.results[0].addresses[0].address_1}, ${post.results[0].addresses[0].city}, ${post.results[0].addresses[0].state}, ${post.results[0].addresses[0].postal_code.substring(0, 5)}`,
        gender: `${post.results[0].basic.gender === 'M' ? 'Male' : 'Female'}`,
        npiNumber: `${post.results[0].number}`,
        faxNumber: `${post.results[0].addresses[0].fax_number ? post.results[0].addresses[0].fax_number_copy.join('') : ''}`,
        docaddressAddress: `${post.results[0].addresses[0].address_1}, ${post.results[0].addresses[0].city}, ${post.results[0].addresses[0].state}, ${post.results[0].addresses[0].postal_code.substring(0, 5)}`,
        docaddressFaxNo: `${post.results[0].addresses[0].fax_number ? post.results[0].addresses[0].fax_number_copy.join('') : ''}`,
        countryName: `${post.results[0].addresses[0].country_name}`,
        stateName: `${post.results[0].addresses[0].state}`,
        cityName: `${post.results[0].addresses[0].city}`,
        areaName: `${post.results[0].addresses[0].address_1}`,
        docaddressContactNo: post.results[0].addresses[0].telephone_number.split('-'),
        docaddressPincode: `${post.results[0].addresses[0].postal_code.substring(0, 5)}`,
      }]
    };
    this.bsModalRef = this.modalService.show(SignupDocComponent, {
      id: 501, initialState, backdrop: true,
      ignoreBackdropClick: true
    });
  }
  onSubmitNPI = (post: {
    npiNumber: string;
    mobileNumber: string;
    recaptcha: string;
  }) => {
    if (!this.checkControlPostNPI(post)) {
      this.markFormTouched(this.npiForm);
      if (this.npiForm.valid && this.findInvalidControlsNPI().length === 0) {
        this.alreadyExistNpi = '';
        this.error = '';
        this.getNPI(JSON.stringify(post)).then((response: {
          results: Record[];
        }) => {
          this.bsModalRef.hide();
          this.npiForm.reset();
          this.spinner.hide();
          this.npiForm.get('recaptcha').reset();
          response.results[0].addresses[0].fax_number_copy = response.results[0].addresses[0].fax_number ? response.results[0].addresses[0].fax_number.split('-') : [];
          setTimeout(() => {
            this.openSignUp(response, post.mobileNumber ? post.mobileNumber : '');
          }, 600);
        }).catch((error) => {
          if (error === 'Npi is already registered with us.') {
            this.error = '';
            this.alreadyExistNpi = `It seems your number is already registered with us.`;
          } else {
            this.alreadyExistNpi = '';
            this.error = error;
          }
          console.error(error);
          this.spinner.hide();
        });
      }
    }
    if (this.checkControlPostNPI(post)) {
      this.markFormTouched(this.npiForm);
    }
  }
  onClickLogin = (post: {
    doctorMobile: string;
    doctorPassword: string;
    terms: boolean;
  }) => {
    if (!this.checkControlPost(post)) {
      this.markFormTouched(this.logIn);
      if (this.logIn.valid && this.findInvalidControlsLogin().length === 0) {
        this.error = '';
        this.spinner.show();
        this.docsLogin(JSON.stringify(post)).then((success: Doctor[]) => {
          this.docService.unSubscribe();
          this.bsModalRef.hide();
          if (post.terms === true) {
            this.service.setDocLocal(JSON.stringify(success[0]));
            this.service.removeSession();
          } else {
            this.service.setDocSession(JSON.stringify(success[0]));
            this.service.removeLocal();
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
  docsLogin = (post: string) => {
    return new Promise((resolve, reject) => {
      this.service.signIn(post).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response[0].data);
        } else {
          reject('Invalid username and password');
        }
      }, () => {
        reject('some error occured.');
      }
      );
    });
  }
  checkControlPost = (post: {
    doctorMobile: string;
    doctorPassword: string;
    terms: boolean;
  }) => {
    let invalid = false;
    Object.keys(post).forEach((key: string) => {
      if (key === 'doctorMobile' && !this.logIn.get(`${key}`).value) {
        this.logIn.get(`${key}`).setValidators([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)]);
        this.logIn.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'doctorPassword' && !this.logIn.get(`${key}`).value) {
        this.logIn.get(`${key}`).setValidators([Validators.required]);
        this.logIn.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
    });
    return invalid;
  }
  checkControlPostNPI = (post: {
    npiNumber: string;
    recaptcha: string;
    mobileNumber: string;
  }) => {
    let invalid = false;
    Object.keys(post).forEach((key: string) => {
      if (key === 'npiNumber' && !this.npiForm.get(`${key}`).value) {
        this.npiForm.get(`${key}`).setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
        this.npiForm.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'recaptcha' && !this.npiForm.get(`${key}`).value) {
        this.npiForm.get(`${key}`).setValidators([Validators.required]);
        this.npiForm.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
    });
    return invalid;
  }
  clearControlLogin = () => {
    Object.keys(this.logIn.value).forEach((key: string) => {
      if (key === 'doctorMobile') {
        this.logIn.get(`${key}`).patchValue('');
        if (this.logIn.get(`${key}`).validator) {
          const validator = this.logIn.get(`${key}`).validator({} as AbstractControl);
          if (validator && validator.required) {
            this.logIn.get(`${key}`).clearValidators();
            this.logIn.get(`${key}`).updateValueAndValidity({ onlySelf: true });
          }
        }
      }
      if (key === 'doctorPassword') {
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
  clearControlNPI = () => {
    Object.keys(this.logIn.value).forEach((key: string) => {
      this.logIn.get(`${key}`).patchValue('');
      if (this.logIn.get(`${key}`).validator) {
        const validator = this.logIn.get(`${key}`).validator({} as AbstractControl);
        if (validator && validator.required) {
          this.logIn.get(`${key}`).clearValidators();
          this.logIn.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        }
      }
    });
  }
  getNPI = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.service.getNPIinfo(post).subscribe((response) => {
        if (response[0].status === 'true') {
          if (response[0].data.results.length !== 0) {
            resolve(response[0].data);
          } else {
            reject('You have entered an invalid NPI.');
          }
        } else {
          reject(response[0].message);
        }
      }, () => reject('some error occured, please try again later'));
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
  findInvalidControlsNPI = () => {
    const invalid = [];
    const controls = this.npiForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  handleReset = () => {
    this.npiForm.get('recaptcha').clearValidators();
    this.npiForm.get('recaptcha').updateValueAndValidity();
    this.npiForm.get('recaptcha').patchValue(null);
  }
  handleExpire = () => {
    this.npiForm.get('recaptcha').patchValue(null);
  }
  handleLoad = () => {
    this.npiForm.get('recaptcha').patchValue(null);
  }
  handleSuccess = ($event: any) => {
    this.npiForm.get('recaptcha').patchValue($event);
  }
}
