import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-fac-contact-us',
  templateUrl: './fac-contact-us.component.html',
  styleUrls: ['./fac-contact-us.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacContactUsComponent implements OnInit {
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
    private cd: ChangeDetectorRef
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
      enableHtml : true,
     });
  }
}
