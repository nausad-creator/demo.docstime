import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfirmationPopUpComponent } from '../confirmation-pop-up/confirmation-pop-up.component';
import { DocsService } from '../docs/docs.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-signup-doc',
  templateUrl: './signup-doc.component.html',
  styleUrls: ['./signup-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupDocComponent implements OnInit {
  list: any[] = [];
  defaultmyImgUrl = 'assets/img/user-icon.png';
  imageUrl: string;
  modalRef: BsModalRef;
  modalRefTermAndPrivacy: BsModalRef;
  signUPForm: FormGroup;
  error: string;
  name: string;
  maxSize = 2048000;
  vOpen = false;
  baseUrl = `${environment.apiBaseUrl}/backend/web/uploads`;
  selectedFiles: File;
  event: EventEmitter<any> = new EventEmitter();
  innerHTMLterms$: Observable<Array<any>>;
  innerHTMLprivacy$: Observable<Array<any>>;
  countryCodeOptions = [
    { code: '+91', flag: 'assets/img/flag_india_1.png' },
    { code: '+129', flag: 'assets/img/flag_uae_1.png' },
    { code: '+65', flag: 'assets/img/flag_usa_1.png' }
  ];
  flag = 'assets/img/flag_india_1.png'; // default
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg',
    keyboard: false
  };
  constructor(
    private service: HomeService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private docService: DocsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    // for signUP
    this.signUPForm = this.fb.group({
      doctorEmail: [null, Validators.compose([Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      doctorFullName: [this.list[0].fullName ? this.list[0].fullName : ''],
      doctorFirstName: [this.list[0].first_name ? this.list[0].first_name : ''],
      doctorLastName: [this.list[0].last_name ? this.list[0].last_name : ''],
      doctorGender: [this.list[0].gender ? this.list[0].gender : ''],
      doctorMobile: [this.list[0].contact ? this.formatMobileNumberAndFax(this.list[0].contact) : '', Validators.compose([this.customValidatorUSnumber])],
      doctorProfileImage: [''],
      doctorNPI: [this.list[0].npiNumber ? this.list[0].npiNumber : ''],
      doctorFax: [this.list[0].faxNumber ? this.formatMobileNumberAndFax(this.list[0].faxNumber) : '', Validators.compose([this.customValidatorUSFAXnumber])],
      doctorAddress: [this.list[0].address ? this.list[0].address : ''],
      doctorPassword: [''],
      facilityID: [''],
      specialityIDs: [''],
      degreeID: [''],
      languageID: ['1'],
      userCountryCode: [this.countryCodeOptions[0].code],
      termsAndPrivacy: [],
      hippa: [],
    });
    this.innerHTMLterms$ = this.service.cmsTermsAndConditions;
    this.innerHTMLprivacy$ = this.service.cmsPrivacyPolicy;
  }
  customValidatorUSnumber(control: AbstractControl): ValidationErrors {
    const error = {
      name: '',
      message: ''
    };
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (control.value !== '') {
      if (!phoneRegex.test(control.value)) {
        control.value.replace(phoneRegex, '($1) $2-$3');
        error.name = 'invalidPhone';
        error.message = 'Phone number must be only 10 digit.';
        return error;
      }
      return null;
    }
    return null;
  }
  customValidatorUSFAXnumber(control: AbstractControl): ValidationErrors {
    const error = {
      name: '',
      message: ''
    };
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (control.value !== '') {
      if (!phoneRegex.test(control.value)) {
        control.value.replace(phoneRegex, '($1) $2-$3');
        error.name = 'invalidPhone';
        error.message = 'Fax number must be only 10 digit.';
        return error;
      }
      return null;
    }
    return null;
  }
  formatMobileNumberAndFax = (text: string) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = match[1] ? '+1 ' : '';
      const n = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
      return n;
    }
    return text;
  }
  onCloseSignup = () => {
    this.bsModalRef.hide();
  }
  onChangeCode = (code: string) => {
    this.flag = this.countryCodeOptions.filter((data) => data.code === code)[0].flag;
  }
  onSubmitRegister = async (post: any) => {
    if (!this.checkControlPost(post)) {
      this.markFormTouched(this.signUPForm);
      if (this.signUPForm.valid && this.findInvalidControls().length === 0) {
        this.error = '';
        this.spinner.show();
        const data = {
          logindoctorID: '0',
          doctorEmail: post.doctorEmail,
          doctorMobile: post.doctorMobile.match(/\d/g).join(''),
          languageID: '1',
        };
        await this.duplicate(JSON.stringify(data)).then(async (response: Array<any>) => {
          if (response[0].status === 'true') {
            await this.uploadFiles(this.selectedFiles).then((fulFilled: Array<any>) => {
              fulFilled.length > 0 ? this.name = fulFilled[0].fileName : this.name = '';
            }).catch((error) => {
              console.error(error);
            }).finally(() => this.submitRegister(post));
          } else if (response[0].message === 'Email already exist.') {
            this.spinner.hide();
            this.signUPForm.controls.doctorEmail.setErrors({ emailAlreadyExist: true });
            this.cd.markForCheck();
          } else {
            this.spinner.hide();
            this.signUPForm.controls.doctorMobile.setErrors({ mobileExist: true });
            this.cd.markForCheck();
          }
        }).catch(() => {
          this.spinner.hide();
          this.error = 'some error occured, please try again after some time.';
          this.cd.markForCheck();
        });
      }
    }
    if (this.checkControlPost(post)) {
      this.markFormTouched(this.signUPForm);
      this.cd.markForCheck();
    }
  }
  submitRegister = (post: any) => {
    const data = {
      doctorEmail: post.doctorEmail,
      doctorFullName: this.list[0].fullName,
      doctorFirstName: post.doctorFirstName,
      doctorLastName: post.doctorLastName,
      doctorGender: this.list[0].gender,
      doctorMobile: post.doctorMobile.match(/\d/g).join(''),
      doctorProfileImage: this.name ? this.name : '',
      doctorNPI: post.doctorNPI,
      doctorFax: post.doctorFax.match(/\d/g).join(''),
      doctorAddress: post.doctorAddress,
      specialityIDs: '',
      degreeID: '',
      facilityID: '',
      doctorPassword: '',
      languageID: '1'
    };
    this.register(JSON.stringify(data)).then((res) => {
      this.list[0].docaddressFaxNo = post.doctorFax.match(/\d/g).join('');
      this.list[0].docaddressContactNo.join('');
      this.list[0].logindoctorID = res[0].doctorID;
      this.list[0].languageID = '1';
      this.addAddress(JSON.stringify(this.list[0])).then(() => {
        this.bsModalRef.hide();
        this.spinner.hide();
      }).catch((error) => {
        this.spinner.hide();
        this.error = error;
        console.error(error);
        this.cd.markForCheck();
      }).finally(() => {
        setTimeout(() => {
          this.openConfirmationModal();
        }, 1000);
      });
    }).catch((error) => {
      this.spinner.hide();
      this.error = error;
      console.error(error);
      this.cd.markForCheck();
    });
  }
  checkControlPost = (post: any) => {
    let invalid = false;
    Object.keys(post).forEach((key: string) => {
      if (key === 'doctorEmail' && !this.signUPForm.get(`${key}`).value) {
        this.signUPForm.get(`${key}`).setValidators([Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])]);
        this.signUPForm.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'doctorMobile' && !this.signUPForm.get(`${key}`).value) {
        this.signUPForm.get(`${key}`).setValidators([Validators.compose([Validators.required, this.customValidatorUSnumber])]);
        this.signUPForm.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'doctorFax' && !this.signUPForm.get(`${key}`).value) {
        this.signUPForm.get(`${key}`).setValidators([Validators.compose([Validators.required, this.customValidatorUSFAXnumber])]);
        this.signUPForm.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'doctorAddress' && !this.signUPForm.get(`${key}`).value) {
        this.signUPForm.get(`${key}`).setValidators([Validators.required]);
        this.signUPForm.get(`${key}`).updateValueAndValidity({ onlySelf: true });
        return invalid = true;
      }
      if (key === 'termsAndPrivacy' && (!this.signUPForm.get(`termsAndPrivacy`).value || this.signUPForm.get(`termsAndPrivacy`).value === false)) {
        this.signUPForm.get(`termsAndPrivacy`).patchValue('');
        this.signUPForm.get(`termsAndPrivacy`).setValidators(Validators.compose([Validators.required]));
        this.signUPForm.get(`termsAndPrivacy`).updateValueAndValidity({ onlySelf: true, emitEvent: true });
        return invalid = true;
      }
      if (key === 'hippa' && (!this.signUPForm.get(`hippa`).value || this.signUPForm.get(`hippa`).value === false)) {
        this.signUPForm.get(`hippa`).patchValue('');
        this.signUPForm.get(`hippa`).setValidators(Validators.compose([Validators.required]));
        this.signUPForm.get(`hippa`).updateValueAndValidity({ onlySelf: true, emitEvent: true });
        return invalid = true;
      }
    });
    return invalid;
  }
  openConfirmationModal = () => {
    const initialState = {
      list: [{
        messageFirst: `<p class="mb-0">Thank you for registering with DocsTime.</p> <p>we will verify your account and initiate onboarding process within 24 Hours.</p> <p>If you need immediate assistance call us at <br><a>"800-991-6782"</a>.</p?`,
        messageSecond: `You will receive an email with further instructions, once your account is verified by DocsTime Adminitration.`
      }]
    };
    this.modalRef = this.modalService.show(ConfirmationPopUpComponent, { id: 601, animated: false, ignoreBackdropClick: true, keyboard: false, class: 'modal-dialog-centered', initialState });
  }
  duplicate = (post: string) => {
    return new Promise((resolve, reject) => {
      this.service.doctorDuplicate(post).subscribe(
        (response) => {
          resolve(response);
        }, error => { reject(error); });
    });
  }
  register = (post: string) => {
    return new Promise((resolve, reject) => {
      this.service.doctorRegistration(post).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response[0].data);
        } else {
          reject(response[0].message);
        }
      }, () => reject('some error occured, please try again later'));
    });
  }
  addAddress = (post: string) => {
    return new Promise((resolve, reject) => {
      this.service.doctorAddAddress(post).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response[0].data);
        } else {
          reject(response[0].message);
        }
      }, () => reject('some error occured, please try again later'));
    });
  }
  onSelectFile = async (event: any) => {
    if (event.target.files.length > 0) {
      if (event.target.files[0].size <= this.maxSize) {
        this.selectedFiles = event.target.files[0] as File;
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFiles);
        reader.onload = () => {
          this.imageUrl = reader.result as string;
          this.cd.markForCheck();
        };
      } else {
        this.toastr.warning('File size Should not be more than 2 MB');
      }
    }
  }
  uploadFiles = (file: File) => {
    return new Promise((resolve, reject) => {
      if (file) {
        const data = { file, fileName: file.name, filePath: 'doctor', logindoctorID: '' };
        this.docService.uploadFile(data).subscribe((response) => {
          if (response[0].status === 'true') {
            resolve(response);
          } else {
            reject(response[0].message);
            this.toastr.error(response[0].message, 'error');
          }
        }, error => {
          console.error(error);
          this.toastr.error('some error occured');
          this.spinner.hide();
        });
      } else {
        resolve([]);
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
  findInvalidControls = () => {
    const invalid = [];
    const controls = this.signUPForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  closeModal = (modalId?: number) => {
    this.modalService.hide(modalId);
  }
  openModal = (template: TemplateRef<any>) => {
    this.modalRefTermAndPrivacy = this.modalService.show(template, this.config);
  }
}
