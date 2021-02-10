import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-contact-docstime',
  template: `
  <!-- breadcrumb start-->
  <section class="breadcrumb breadcrumb_bg">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb_iner">
            <div class="breadcrumb_iner_item">
              <h2>Contact Us</h2>
              <!-- <p>Home<span>/</span>Contact Us</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- breadcrumb start-->
  <section class="regervation_part">
    <div class="container contact-section section_padding">
      <!-- <iframe
        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2965.0824050173574!2d-93.63905729999999!3d41.998507000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sWebFilings%2C+University+Boulevard%2C+Ames%2C+IA!5e0!3m2!1sen!2sus!4v1390839289319"
        width="100%" height="400" frameborder="0" style="border:0"></iframe> -->
      <div class="row align-items-center regervation_content">
        <div class="col-12">
          <h2 class="contact-title">Get in Touch</h2>
        </div>
        <div class="col-lg-8 regervation_part_iner">
          <form class="form-contact contact_form" [formGroup]="contactUs" (ngSubmit)="onSubmitContact(contactUs.value)"
            method="post" id="contactForm" novalidate="novalidate">
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <input class="form-control" oninput="this.value = this.value.replace(/^\s+/g, '')" name="name" formControlName="name" id="name" type="text"
                    onFocus="this.placeholder = ''" onBlur="this.placeholder = 'Name*'"
                    placeholder="Name*">
                  <small class="text-danger small"
                    *ngIf="contactUs.controls['name'].hasError('required') && (contactUs.controls['name'].dirty || contactUs.controls['name'].touched)">This
                    field is required</small>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <input class="form-control" oninput="this.value = this.value.replace(/^\s+/g, '')" name="email" id="email" formControlName="email" type="email"
                    onFocus="this.placeholder = ''" onBlur="this.placeholder = 'Email address*'"
                    placeholder="Email address*">
                  <small class="text-danger small"
                    *ngIf="contactUs.controls['email'].hasError('pattern') && (contactUs.controls['email'].dirty || contactUs.controls['email'].touched )">Please
                    enter valid email.</small>
                  <small class="text-danger small"
                    *ngIf="contactUs.controls['email'].hasError('required') && (contactUs.controls['email'].dirty || contactUs.controls['email'].touched)">This
                    field is required</small>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <input class="form-control" oninput="this.value = this.value.replace(/^\s+/g, '')" maxlength="10" pattern="[1-9]{1}[0-9]{9}" name="number"
                    formControlName="number" id="number" type="text" onFocus="this.placeholder = ''"
                    onBlur="this.placeholder = 'Contact number*'" placeholder="Contact number*">
                  <small class="text-danger small"
                    *ngIf="contactUs.controls['number'].hasError('required') && (contactUs.controls['number'].dirty || contactUs.controls['number'].touched)">This
                    field is required</small>
                  <small class="text-danger small"
                    *ngIf="contactUs.controls['number'].hasError('pattern') && (contactUs.controls['number'].dirty || contactUs.controls['number'].touched)">Contact
                    number must be only 10 digits</small>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <textarea class="form-control w-100" oninput="this.value = this.value.replace(/^\s+/g, '')" formControlName="message" name="message" id="message" cols="30"
                    rows="9" onFocus="this.placeholder = ''" onBlur="this.placeholder = 'Message*'"
                    placeholder="Message*"></textarea>
                  <small class="text-danger small"
                    *ngIf="contactUs.controls['message'].hasError('required') && (contactUs.controls['message'].dirty || contactUs.controls['message'].touched)">This
                    field is required</small>
                </div>
              </div>
              <!-- <div class="col-12">
                <div class="form-group">
                  <input class="form-control" name="subject" id="subject" formControlName="subject" type="text"
                    onFocus="this.placeholder = ''" onBlur="this.placeholder = 'Enter Subject*'"
                    placeholder="Enter Subject*">
                  <small class="text-danger small"
                    *ngIf="contactUs.controls['subject'].hasError('required') && (contactUs.controls['subject'].dirty || contactUs.controls['subject'].touched)">This
                    field is required</small>
                </div>
              </div> -->
              <div class="col-sm-6">
                <div class="form-group">
                  <ngx-recaptcha2 #captchaElem [siteKey]="siteKey" (reset)="handleReset()" (expire)="handleExpire()"
                    (load)="handleLoad()" (success)="handleSuccess($event)" [useGlobalDomain]="false" [size]="size"
                    [hl]="lang" [theme]="theme" [type]="type" formControlName="recaptcha">
                  </ngx-recaptcha2>
                  <small class="text-danger small"
                    *ngIf="contactUs.controls['recaptcha'].hasError('required') && (contactUs.controls['recaptcha'].dirty || contactUs.controls['recaptcha'].touched)">This
                    field is required</small>
                </div>
              </div>
            </div>
            <div class="form-group mt-3">
              <button type="submit" class="button button-contactForm btn_1">Send
                Message</button>
              <!-- <button type="button" (click)="openToastr()" class="button button-contactForm btn_1">Open Toastr</button> -->
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [
    `.small {
      font-size: 0.8em;
    }`,
    `.required-field::before {
      content: "*";
      color: red;
    }`,
    `.cursr {
      cursor: pointer;
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactDocstimeComponent implements OnInit {
  contactUs: FormGroup;
  siteKey = '6Lf9ZuQZAAAAAC4qh2Wzdhfb_jr9tuWxip39U8WO';
  size = 'Normal';
  theme = 'Light';
  type = 'Image';
  lang = 'en';
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  constructor(
    private spinner: NgxSpinnerService,
    public service: HomeService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {
    this.contactUs = this.fb.group({
      email: [null, Validators.compose([Validators.required,
      Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
      ])],
      name: [null, Validators.compose([Validators.required])],
      number: [null, Validators.compose([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')])],
      message: [null, Validators.compose([Validators.required])],
      subject: [null],
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }
  onSubmitContact = (post: any) => {
    this.markFormTouched(this.contactUs);
    if (this.contactUs.valid) {
      this.spinner.show();
      const data = {
        languageID: '1',
        contactusName: post.name ? post.name : '',
        contactusEmail: post.email ? post.email : '',
        contactusMobile: post.number ? post.number : '',
        contactusSubject: post.subject ? post.subject : 'subject',
      };
      this.service.contactUsRegistration(JSON.stringify(data)).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.contactUs.reset();
              this.contactUs.get('recaptcha').reset();
              this.captchaElem.reloadCaptcha();
              this.spinner.hide();
              this.cd.markForCheck();
              this.openToastr();
            }, 1000);
          } else {
            this.spinner.hide();
            setTimeout(() => {
              this.toastr.error(response[0].meassge);
            }, 0);
          }
        }, error => {
          this.spinner.hide();
          setTimeout(() => {
            this.toastr.error('some error occured');
          }, 0);
          console.error(error);
        });
    }
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
  handleReset = () => { };
  handleExpire = () => {
    this.contactUs.get('recaptcha').patchValue(null);
    this.cd.markForCheck();
  }
  handleLoad = () => { };
  handleSuccess = ($event: any) => {
    this.contactUs.get('recaptcha').patchValue($event);
    this.cd.markForCheck();
  }
  openToastr = () => {
    this.toastr.success('<h5>Thank you for choosing DocsTime.</h5>We will get back to you within 24 hrs.'
      , '', {
      positionClass: 'toast-center-center-contact-us',
      timeOut: 6000,
      enableHtml: true,
    });
  }
}
