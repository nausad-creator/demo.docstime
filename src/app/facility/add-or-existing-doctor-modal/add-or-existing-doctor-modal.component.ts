import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DocsService } from 'src/app/docs/docs.service';
import { DoctorOtpVerificationComponent } from 'src/app/doctor-otp-verification/doctor-otp-verification.component';
import { HomeService } from 'src/app/home.service';
import { environment } from 'src/environments/environment';
import { AddDoctorResetPasswordModalComponent } from '../add-doctor-reset-password-modal/add-doctor-reset-password-modal.component';

@Component({
  selector: 'app-add-or-existing-doctor-modal',
  templateUrl: './add-or-existing-doctor-modal.component.html',
  styleUrls: ['./add-or-existing-doctor-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOrExistingDoctorModalComponent implements OnInit {
  list: any[] = [];
  @Input() status: string;
  defaultmyImgUrl = 'assets/img/user-icon.png';
  imageUrl: string;
  modalRef: BsModalRef;
  addDoctorForm: FormGroup;
  editDoctorForm: FormGroup;
  error: string;
  emailForCheck: string;
  mobileForCheck: string;
  name: string;
  maxSize = 2048000;
  baseUrl = `${environment.fileUrl}`;
  selectedFiles: File;
  degreeList$: Observable<Array<any>>;
  specialityList$: Observable<Array<any>>;
  event: EventEmitter<any> = new EventEmitter();
  countryCodeOptions = [
    { code: '+91', flag: 'assets/img/flag_india_1.png' },
    { code: '+129', flag: 'assets/img/flag_uae_1.png' },
    { code: '+65', flag: 'assets/img/flag_usa_1.png' }
  ];
  flag = 'assets/img/flag_india_1.png'; // default
  constructor(
    private service: HomeService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private docService: DocsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.status = this.list[0].status;
    // for add-doctor
    this.addDoctorForm = this.fb.group({
      doctorEmail: [this.list[0].email ? this.list[0].email : '', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      doctorFullName: [this.list[0].fullName ? this.list[0].fullName : ''],
      doctorFirstName: [this.list[0].first_name ? this.list[0].first_name : ''],
      doctorLastName: [this.list[0].last_name ? this.list[0].last_name : ''],
      doctorGender: [this.list[0].gender ? this.list[0].gender : ''],
      doctorMobile: [this.list[0].contact ? this.formatMobileNumberAndFax(this.list[0].contact) : '', Validators.compose([Validators.required, this.customValidatorUSnumber])],
      doctorProfileImage: [this.list[0].profile ? this.list[0].profile : ''],
      doctorNPI: [this.list[0].npiNumber ? this.list[0].npiNumber : ''],
      doctorFax: [this.list[0].faxNumber ? this.formatMobileNumberAndFax(this.list[0].faxNumber) : '', Validators.compose([Validators.required, this.customValidatorUSFAXnumber])],
      doctorAddress: [this.list[0].address ? this.list[0].address : '', Validators.required],
      doctorPassword: [''],
      facilityID: [''],
      specialityIDs: [null, Validators.required],
      degreeID: [null, Validators.required],
      languageID: ['1'],
      userCountryCode: [this.countryCodeOptions[0].code, Validators.compose([Validators.required])],
    });
    // for edit-doctor
    this.editDoctorForm = this.fb.group({
      doctorEmail: [this.list[0].email ? this.list[0].email : ''],
      doctorFullName: [this.list[0].fullName ? this.list[0].fullName : ''],
      doctorFirstName: [this.list[0].first_name ? this.list[0].first_name : ''],
      doctorLastName: [this.list[0].last_name ? this.list[0].last_name : ''],
      doctorGender: [this.list[0].gender ? this.list[0].gender : ''],
      doctorMobile: [this.list[0].contact ? this.formatMobileNumberAndFax(this.list[0].contact) : ''],
      doctorProfileImage: [this.list[0].profile ? this.list[0].profile : ''],
      doctorNPI: [this.list[0].npiNumber ? this.list[0].npiNumber : ''],
      doctorFax: [this.list[0].faxNumber ? this.formatMobileNumberAndFax(this.list[0].faxNumber) : ''],
      doctorAddress: [this.list[0].address ? this.list[0].address : ''],
      doctorPassword: [''],
      facilityID: [this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID],
      specialityIDs: [this.list[0].specialityIDs ? this.list[0].specialityIDs : ''],
      degreeID: [this.list[0].degreeID ? this.list[0].degreeID : ''],
      languageID: ['1'],
      doctorID: [this.list[0].doctorID],
      doctorDOB: [this.list[0].doctorDOB],
      userCountryCode: [{ value: this.countryCodeOptions[0].code, disabled: true }],
    });
    this.emailForCheck = this.list[0].email ? this.list[0].email : '';
    this.mobileForCheck = this.list[0].contact ? this.list[0].contact : '';
    this.imageUrl = `${this.baseUrl}/doctor/${this.list[0].profile ? this.list[0].profile : ''}`;
    // get data
    this.degreeList$ = this.service.getDegrees;
    this.specialityList$ = this.service.getSpecility;
    this.cd.markForCheck();
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
  onSubmitAdd = async (post: any) => {
    this.markFormTouched(this.addDoctorForm);
    const invalidinput = this.findInvalidControlsAdd();
    if (this.addDoctorForm.valid && invalidinput.length === 0) {
      this.spinner.show();
      const data = {
        logindoctorID: '0',
        doctorEmail: post.doctorEmail,
        doctorMobile: post.doctorMobile.match(/\d/g).join(''),
        languageID: '1',
      };
      await this.duplicate(JSON.stringify(data)).then(async (response: Array<any>) => {
        if (response[0].status === 'true') {
          await this.uploadFiles(this.selectedFiles)
            .then((fulFilled: Array<any>) => {
              fulFilled.length > 0 ? this.name = fulFilled[0].fileName : this.name = '';
            }).catch((error) => {
              console.error(error);
            }).finally(() => this.submitRegister(post));
        } else if (response[0].message === 'Email already exist.') {
          this.spinner.hide();
          this.addDoctorForm.controls.doctorEmail.setErrors({ emailAlreadyExist: true });
          this.cd.markForCheck();
        } else {
          this.spinner.hide();
          this.addDoctorForm.controls.doctorMobile.setErrors({ mobileExist: true });
          this.cd.markForCheck();
        }
      }).catch(() => {
        this.spinner.hide();
        this.error = 'some error occured, please try again after some time.';
        this.cd.markForCheck();
      });
    }
  }
  onSubmitUpdate = async () => {
    this.spinner.show();
    const json = {
      languageID: '1',
      logindoctorID: this.list[0].doctorID ? this.list[0].doctorID : '',
      doctorEmailMobile: this.list[0].contact ? this.list[0].contact.match(/\d/g).join('') : this.list[0].email
    };
    this.service.doctorResendOTP(JSON.stringify(json)).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.bsModalRef.hide();
          setTimeout(() => {
            if (!isNaN(json.doctorEmailMobile)) {
              this.openVerificationModal(this.editDoctorForm.value, 'Mobile number');
              this.toastr.success('We have sent otp on your registered mobile.');
            } else {
              this.openVerificationModal(this.editDoctorForm.value, 'email address');
              this.toastr.success('We have sent otp on your registered email.');
            }
          }, 500);
        } else {
          this.spinner.hide();
          this.error = response[0].message;
          this.cd.markForCheck();
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      });
  }
  submitRegister = (post: any) => {
    const data = {
      doctorEmail: post.doctorEmail.trim(),
      doctorFullName: this.list[0].fullName.trim(),
      doctorFirstName: post.doctorFirstName.trim(),
      doctorLastName: post.doctorLastName.trim(),
      doctorGender: this.list[0].gender,
      doctorMobile: post.doctorMobile.match(/\d/g).join(''),
      doctorProfileImage: this.name ? this.name : '',
      doctorNPI: post.doctorNPI,
      doctorFax: post.doctorFax.match(/\d/g).join(''),
      doctorAddress: post.doctorAddress,
      specialityIDs: post.specialityIDs,
      degreeID: post.degreeID,
      facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
      doctorPassword: '',
      languageID: '1'
    };
    this.register(JSON.stringify(data)).then((res) => {
      this.list[0].docaddressFaxNo = post.doctorFax.match(/\d/g).join('');
      this.list[0].logindoctorID = res[0].doctorID;
      this.list[0].languageID = '1';
      this.addAddress(JSON.stringify(this.list[0])).then(() => {
        this.modalService.hide();
        this.spinner.hide();
      }).catch((error) => {
        this.spinner.hide();
        this.error = error;
        console.error(error);
        this.cd.markForCheck();
      }).finally(() => {
        setTimeout(() => {
          this.openCreatePassModal(res[0].doctorID);
        }, 500);
      });
    }).catch((error) => {
      this.spinner.hide();
      this.error = error;
      console.error(error);
      this.cd.markForCheck();
    });
  }
  openCreatePassModal = (doctorID: string) => {
    const initialState = {
      list: [{
        doctorID: `${doctorID}`,
      }]
    };
    this.modalRef = this.modalService.show(AddDoctorResetPasswordModalComponent, { id: 607, initialState });
  }
  openVerificationModal = (res: any, message: string) => {
    const initialState = {
      list: [{
        res,
        message,
        status: 'facilityAddDoctor'
      }]
    };
    this.spinner.hide();
    this.bsModalRef = this.modalService.show(DoctorOtpVerificationComponent, { id: 199, initialState });
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
  findInvalidControlsAdd = () => {
    const invalid = [];
    const controls = this.addDoctorForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
}
