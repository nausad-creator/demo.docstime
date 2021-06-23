import { Component, DoCheck, EventEmitter, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReCaptcha2Component } from 'ngx-captcha';
import { NgxSpinnerService } from 'ngx-spinner';
import { Login } from '../docs';
import { DocsService } from '../docs/docs.service';
import { DoctorForgetPasswordComponent } from '../doctor-forget-password/doctor-forget-password.component';
import { DoctorSetPasswordComponent } from '../doctor-set-password/doctor-set-password.component';
import { HomeService } from '../home.service';
import { SignupDocComponent } from '../signup-doc/signup-doc.component';

@Component({
  selector: 'app-login-signup-modal',
  templateUrl: './login-signup-modal.component.html',
  styleUrls: ['./login-signup-modal.component.css']
})
export class LoginSignupModalComponent implements OnInit, DoCheck {
  list: any[] = [];
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
  event: EventEmitter<any> = new EventEmitter();
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
      emailOrNumber: [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      password: [null, Validators.required],
      terms: [true],
    });
    // for NPI
    this.npiForm = this.fb.group({
      npi: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{10}$')])],
      mobileNumber: [null, Validators.compose([Validators.pattern('^[0-9]{10}$')])],
      recaptcha: [null]
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
    this.logIn.reset();
    this.logIn.get('terms').patchValue(true);
  }
  resetNPI = () => {
    this.error = '';
    this.alreadyExistNpi = '';
    this.npiForm.reset();
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

  openSignUp = (post: any, mobileNumber?: string) => {
    const initialState = {
      list: [{
        fullName: `${post.results[0].basic.first_name} ${post.results[0].basic.last_name}`,
        first_name: `${post.results[0].basic.first_name}`,
        last_name: `${post.results[0].basic.last_name}`,
        contact: mobileNumber ? mobileNumber : post.results[0].addresses[0].telephone_number.split('-').join(''),
        address: `${post.results[0].addresses[0].address_1}, ${post.results[0].addresses[0].city}, ${post.results[0].addresses[0].state}, ${post.results[0].addresses[0].postal_code.substring(0, 5)}`,
        gender: `${post.results[0].basic.gender === 'M' ? 'Male' : 'Female'}`,
        npiNumber: `${post.results[0].number}`,
        faxNumber: `${post.results[0].addresses[0].fax_number ? post.results[0].addresses[0].fax_number.join('') : ''}`,
        docaddressAddress: `${post.results[0].addresses[0].address_1}, ${post.results[0].addresses[0].city}, ${post.results[0].addresses[0].state}, ${post.results[0].addresses[0].postal_code.substring(0, 5)}`,
        docaddressFaxNo: `${post.results[0].addresses[0].fax_number ? post.results[0].addresses[0].fax_number.join('') : ''}`,
        countryName: `${post.results[0].addresses[0].country_name}`,
        stateName: `${post.results[0].addresses[0].state}`,
        cityName: `${post.results[0].addresses[0].city}`,
        areaName: `${post.results[0].addresses[0].address_1}`,
        docaddressContactNo: post.results[0].addresses[0].telephone_number.split('-'),
        docaddressPincode: `${post.results[0].addresses[0].postal_code.substring(0, 5)}`,
      }]
    };
    this.bsModalRef = this.modalService.show(SignupDocComponent, { id: 501, initialState, backdrop: true,
      ignoreBackdropClick: true });
  }
  onSubmitNPI = (post: any) => {
    if (!post.recaptcha){
      this.npiForm.get('recaptcha').setValidators([Validators.required]);
      this.npiForm.get('recaptcha').updateValueAndValidity();
    }
    this.markFormTouched(this.npiForm);
    if (this.npiForm.valid && this.findInvalidControlsNPI().length === 0) {
      this.alreadyExistNpi = '';
      this.error = '';
      const data = {
        loginuserID: '0',
        languageID: '1',
        facilityID: '0',
        npiNumber: post.npi,
      };
      this.getNPI(JSON.stringify(data)).then((response: any) => {
        this.bsModalRef.hide();
        this.npiForm.reset();
        this.spinner.hide();
        this.npiForm.get('recaptcha').reset();
        response.results[0].addresses[0].fax_number =
        response.results[0].addresses[0].fax_number ?
        response.results[0].addresses[0].fax_number.split('-') : '';
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
  onClickLogin = (post: any) => {
    this.markFormTouched(this.logIn);
    if (this.logIn.valid && this.findInvalidControlsLogin().length === 0) {
      this.error = '';
      this.spinner.show();
      const data: Login = {
        languageID: '1',
        doctorMobile: post.emailOrNumber,
        doctorPassword: post.password,
      };
      this.docsLogin(JSON.stringify(data)).then((success: Array<any>) => {
        this.docService.unSubscribe();
        this.bsModalRef.hide();
        setTimeout(() => {
          if (post.terms === true) {
            this.service.setDocLocal(JSON.stringify(success[0]));
            this.service.removeSession();
          } else {
            this.service.setDocSession(JSON.stringify(success[0]));
            this.service.removeLocal();
          }
          this.logIn.reset();
          this.error = '';
          this.spinner.hide();
          this.triggerEvent('Confirmed');
        }, 600);
      }).catch((error: Array<any>) => {
        if (error.length > 0) {
          this.spinner.hide();
          this.error = error[0].message;
          this.triggerEvent('Error');
        } else {
          this.spinner.hide();
          this.error = 'some error occured in backend.';
          this.triggerEvent('Error');
        }
      });
    } else { this.logIn.controls.terms.setValue(false); }
  }
  docsLogin = (post: string) => {
    return new Promise((resolve, reject) => {
      this.service.signIn(post).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response);
          }
        }, () => {
          reject([]);
        }
      );
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
