import { Component, DoCheck, EventEmitter, KeyValueDiffers, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FacilityLogin } from '../docs';
import { FacilityForgetPasswordComponent } from '../facility-forget-password/facility-forget-password.component';
import { FacilityService } from '../facility/facility.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-facility-login-signup',
  templateUrl: './facility-login-signup.component.html',
  styleUrls: ['./facility-login-signup.component.css']
})
export class FacilityLoginSignupComponent implements OnInit, DoCheck {
  list: any[] = [];
  logIn: FormGroup;
  joinUs: FormGroup;
  modalRef: BsModalRef;
  error: string;
  hide = true;
  login = true;
  differ: any;
  event: EventEmitter<any> = new EventEmitter();
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
      facilityuserEmail: [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      facilityuserPassword: [null, Validators.required],
      terms: [true],
    });
    // join-us form
    this.joinUs = this.fb.group({
      facilityName: [null, Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern('^[a-zA-Z \-\']+')])],
      facilityEmail: [null, Validators.compose([Validators.required, Validators.
      pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      facilityPhone: [null, Validators.compose([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')])],
      facilityZip: [null, Validators.compose([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{5}$')])],
      faxNumber: [null, Validators.compose([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')])],
      termsAndPrivacy: [true, Validators.compose([
        Validators.required
      ])],
      hippa: [true, Validators.compose([
        Validators.required
      ])],
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
    this.logIn.reset();
    this.logIn.get('terms').patchValue(true);
    this.error = '';
    this.joinUs.reset();
    this.joinUs.get('termsAndPrivacy').patchValue(true);
    this.joinUs.get('hippa').patchValue(true);
  }
  onClickLogin = (post: any) => {
    this.markFormTouched(this.logIn);
    if (this.logIn.valid && this.findInvalidControlsLogin().length === 0) {
      this.error = '';
      this.spinner.show();
      const data: FacilityLogin = {
        facilityuserPassword: post.facilityuserPassword,
        facilityuserEmail: post.facilityuserEmail,
        languageID: post.languageID,
      };
      this.facilityLogin(JSON.stringify(data)).then((success: Array<any>) => {
        this.facilityService.unSubscribe();
        this.bsModalRef.hide();
        setTimeout(() => {
          if (post.terms === true) {
            this.service.setFaLocal(JSON.stringify(success[0]));
            this.service.removeFaSession();
          } else {
            this.service.setFaSession(JSON.stringify(success[0]));
            this.service.removeFaLocal();
          }
          this.logIn.reset();
          this.error = '';
          this.spinner.hide();
          this.triggerEvent('Confirmed');
        }, 600);
      }).catch((error: Array<any>) => {
        if (error.length > 0) {
          this.triggerEvent('Error');
          this.spinner.hide();
          this.error = 'Please enter valid email or password.';
        } else {
          this.triggerEvent('Error');
          this.spinner.hide();
          this.error = 'some error occured in backend.';
        }
      });
    } else { this.logIn.controls.terms.setValue(false); }
  }
  facilityLogin = (post: string) => {
    return new Promise((resolve, reject) => {
      this.service.facilitySignIn(post).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response);
          }
        }, () => {
          reject(['error']);
        }
      );
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
  onJoinUS = (post: any) => {
    this.markFormTouched(this.joinUs);
    if (this.joinUs.valid && this.findInvalidControlsJoinUS().length === 0) {
      const data = {
        facilityuserID: `${'0'}`,
        requestFacilityName: `${post.facilityName}`,
        requestFacilityEmail: `${post.facilityEmail}`,
        requestFacilityMobile: `${post.facilityPhone}`,
        requestFacilityFax: `${post.faxNumber}`,
        requestFacilityZip: `${post.facilityZip}`,
        languageID: `${'1'}`,
      };
      this.join(JSON.stringify(data)).then(() => {
        setTimeout(() => {
          this.spinner.hide();
          this.toastr.success('<h5>Thank you for contacting DocsTime.</h5>We will get back to you within 24 hrs.'
            , '', {
              positionClass: 'toast-center-center-join-us',
              timeOut: 5000,
              enableHtml : true,
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
