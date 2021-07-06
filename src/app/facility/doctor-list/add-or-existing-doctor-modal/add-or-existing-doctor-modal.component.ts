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
  template: `<div class="modal-contents modal" *ngIf="status === 'addDoctor'">
  <!-- Modal Header -->
  <div class="modal-header">
    <h4 class="modal-title">Doctor Details</h4>
    <button type="button" (click)="onCloseSignup()" class="close" data-dismiss="modal">&times;</button>
  </div>
  <!-- Modal body -->
  <div class="modal-body">
    <!-- error handler -->
    <div class="alert alert-danger" role="alert" *ngIf="error">
      <h5 class="alert-heading text-center">Alert!</h5>
      <p class="mb-0 text-center">{{error}}</p>
    </div>
    <!-- handler end -->
    <form class="bootstrap-form needs-validation" (ngSubmit)="onSubmitAdd(addDoctorForm.value)"
      [formGroup]="addDoctorForm">
      <div class="form-group">
        <div class="profileupload">
          <div class="imagebox mt-0 ">
            <label class="hoverable" for="fileInput">
              <img [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="imageUrl" [errorImage]="'assets/img/user-icon.png'">
              <div class="hover-text">
                <input id="fileInput" accept="image/*" (change)="onSelectFile($event)" type='file'>
                <p style="margin-top: 20px; font-family: Lato;">Choose file</p>
              </div>
              <div class="background"></div>
            </label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="signonname" class="text-uppercase text-primary">Name<span class="required-field"></span></label>
        <input type="text" readonly formControlName="doctorFullName" id="signonname" class="form-control" name="signonname"
          value="" required />
      </div>
      <div class="form-group">
        <label for="email" class="text-uppercase text-primary">Email Address<span class="required-field"></span></label>
        <input type="email" formControlName="doctorEmail" placeholder="Enter Email" id="email" class="form-control"
          name="email" />
        <small class="text-danger small"
          *ngIf="addDoctorForm.controls['doctorEmail'].hasError('pattern') && (addDoctorForm.controls['doctorEmail'].dirty || addDoctorForm.controls['doctorEmail'].touched )">Please
          enter valid Email ID</small>
        <small class="text-danger small"
          *ngIf="addDoctorForm.controls['doctorEmail'].hasError('required') && (addDoctorForm.controls['doctorEmail'].dirty || addDoctorForm.controls['doctorEmail'].touched)">Please
          enter Email ID</small>
        <small class="text-danger" *ngIf="addDoctorForm.controls['doctorEmail'].hasError('emailAlreadyExist')">Email
          already
          exist.</small>
      </div>
      <div class="form-group">
        <label for="mobile" class="text-uppercase text-primary">Phone Number<span
            class="required-field"></span></label>
        <input type="text" mask="(000) 000-0000" id="mobile" maxlength="14" placeholder="Enter Phone number" formControlName="doctorMobile" class="form-control" name="mobile" required />
        <small class="text-danger small"
          *ngIf=" addDoctorForm.controls['doctorMobile'].hasError('required') && (addDoctorForm.controls['doctorMobile'].dirty || addDoctorForm.controls['doctorMobile'].touched)">Please
          enter phone number.</small>
        <small class="text-danger small" *ngIf="addDoctorForm.controls.doctorMobile.errors">{{addDoctorForm.controls.doctorMobile.errors.message}}</small>
        <small class="text-danger" *ngIf="addDoctorForm.controls['doctorMobile'].hasError('mobileExist')">Phone number already exist.</small>
      </div>
      <div class="form-group">
        <label for="Fax" class="text-uppercase text-primary">Fax Number<span class="required-field"></span></label>
        <input type="text" mask="(000) 000-0000" maxlength="14" formControlName="doctorFax" id="Fax" class="form-control" name="Fax"
          placeholder="Enter Fax number" value="" required />
        <small class="text-danger small"
          *ngIf=" addDoctorForm.controls['doctorFax'].hasError('required') && (addDoctorForm.controls['doctorFax'].dirty || addDoctorForm.controls['doctorFax'].touched)">Please
          enter fax.</small>
        <small class="text-danger small" *ngIf="addDoctorForm.controls.doctorFax.errors">{{addDoctorForm.controls.doctorFax.errors.message}}</small>
      </div>
      <div class="form-group">
        <label for="Gender" class="text-uppercase text-primary">Gender<span class="required-field"></span></label>
        <input type="text" readonly formControlName="doctorGender" id="Gender" class="form-control" placeholder="Enter Gender"
          name="Gender" />
      </div>
      <div class="form-group">
        <label for="specialityIDs" class="text-uppercase text-primary">Speciality<span
            class="required-field"></span></label>
        <ng-select [closeOnSelect]="true" [searchable]="true" appearance="outline" placeholder="Enter Speciality"
          formControlName="specialityIDs" class="custom" labelForId="specialityList" name="specialityName">
          <ng-option *ngFor="let spec of (specialityList$ | async)" [value]="spec.specialityID">
            {{spec.specialityName}}</ng-option>
        </ng-select>
        <small class="text-danger small"
          *ngIf="addDoctorForm.controls['specialityIDs'].hasError('required') && (addDoctorForm.controls['specialityIDs'].dirty || addDoctorForm.controls['specialityIDs'].touched)">Please
          Select speciality.</small>
      </div>
      <div class="form-group">
        <label for="degreeID" class="text-uppercase text-primary">Qualification<span
            class="required-field"></span></label>
        <ng-select [closeOnSelect]="true" [searchable]="true" appearance="outline" placeholder="Enter Qualification"
          formControlName="degreeID" class="custom" labelForId="degreeList" name="degreeName">
          <ng-option *ngFor="let degree of (degreeList$ | async)" [value]="degree.degreeID">
            {{degree.degreeName}}</ng-option>
        </ng-select>
        <small class="text-danger small"
          *ngIf="addDoctorForm.controls['degreeID'].hasError('required') && (addDoctorForm.controls['degreeID'].dirty || addDoctorForm.controls['degreeID'].touched)">Please
          Select Qualification.</small>
      </div>
      <div class="form-group">
        <label for="Address" class="text-uppercase text-primary">Address<span class="required-field"></span></label>
        <textarea type="text" formControlName="doctorAddress" id="Address" class="form-control"
          placeholder="Enter Address" name="Address" required></textarea>
        <small class="text-danger small"
          *ngIf=" addDoctorForm.controls['doctorAddress'].hasError('required') && (addDoctorForm.controls['doctorAddress'].dirty || addDoctorForm.controls['doctorAddress'].touched)">Please
          enter Address.</small>
      </div>
      <div class="p-3">
        <button type="submit" class="btn btn-primary btn-lg btn-block">Continue</button>
      </div>
    </form>
  </div>

</div>

<div class="modal-contents modal" *ngIf="status === 'editDoctor'">
  <!-- Modal Header -->
  <div class="modal-header">
    <h4 class="modal-title">Doctor Details</h4>
    <button type="button" (click)="onCloseSignup()" class="close" data-dismiss="modal">&times;</button>
  </div>
  <!-- Modal body -->
  <div class="modal-body">
    <!-- error handler -->
    <div class="alert alert-danger" role="alert" *ngIf="error">
      <h5 class="alert-heading text-center">Alert!</h5>
      <p class="mb-0 text-center">{{error}}</p>
    </div>
    <!-- handler end -->
    <form class="bootstrap-form needs-validation" (ngSubmit)="onSubmitUpdate(editDoctorForm.value)"
      [formGroup]="editDoctorForm">
      <div class="form-group">
        <div class="profileupload">
          <div class="imagebox mt-0 ">
            <label class="hoverable" for="fileInput">
              <img [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="imageUrl" [errorImage]="'assets/img/user-icon.png'">
              <div class="hover-text">
              </div>
              <div class="background"></div>
            </label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="signonname" class="text-uppercase text-primary">Name<span class="required-field"></span></label>
        <input type="text" readonly formControlName="doctorFullName" id="signonname" class="form-control" name="signonname"
          value="" required />
      </div>
      <div class="form-group">
        <label for="email" class="text-uppercase text-primary">Email Address<span class="required-field"></span></label>
        <input type="email" readonly formControlName="doctorEmail" placeholder="Enter Email" id="email" class="form-control"
          name="email" />
      </div>
      <div class="form-group">
        <label for="mobile" class="text-uppercase text-primary">Phone Number<span
            class="required-field"></span></label>
        <input type="text" id="mobile" readonly formControlName="doctorMobile" class="form-control" name="mobile" required />
      </div>
      <div class="form-group">
        <label for="Fax" class="text-uppercase text-primary">Fax Number<span class="required-field"></span></label>
        <input type="text" maxlength="10" readonly formControlName="doctorFax" id="Fax" class="form-control" name="Fax"
          placeholder="Enter Fax number" value="" required />
      </div>
      <div class="form-group">
        <label for="Gender" class="text-uppercase text-primary">Gender<span class="required-field"></span></label>
        <input type="text" readonly formControlName="doctorGender" id="Gender" class="form-control" placeholder="Enter Gender"
          name="Gender" />
      </div>
      <div class="form-group">
        <label for="Gender" class="text-uppercase text-primary">Speciality<span class="required-field"></span></label>
        <input type="text" formControlName="specialityIDs" readonly id="doctorSpecility" class="form-control"
          placeholder="Enter Speciality" name="doctorSpecility" />
      </div>
      <div class="form-group">
        <label for="Gender" class="text-uppercase text-primary">Qualification<span class="required-field"></span></label>
        <input type="text" formControlName="degreeID" readonly id="doctorDegree" class="form-control"
          placeholder="Enter Qualification" name="doctorDegree" />
      </div>
      <div class="form-group">
        <label for="Address" class="text-uppercase text-primary">Address<span class="required-field"></span></label>
        <textarea type="text" readonly formControlName="doctorAddress" id="Address" class="form-control"
          placeholder="Enter Address" name="Address" required></textarea>
      </div>
      <div class="p-3">
        <button type="submit" class="btn btn-primary btn-lg btn-block">Continue</button>
      </div>
    </form>
  </div>

</div>`,
  styles: [`.iconify {
    width: 16px;
    height: 16px;
  }
  .hoverable {
    position: relative;
    display: block;
    cursor: pointer;
  }
  .hoverable .hover-text {
    position: absolute;
    display: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
  .hoverable .background {
    position: absolute;
    display: none;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
    border-radius: 50%;
    z-index: 1;
  }
  .hoverable:hover .hover-text {
    display: block;
  }
  .hoverable:hover .background {
    display: block;
  }
  #fileInput {
    display: none;
  }
  .cursr {
    cursor: pointer;
  }
  .mat-progress-bar-fill::after {
    background-color: #28a745;
  }
  .required-field::before {
    content: "*";
    color: red;
  }
  .ng-select.custom ::ng-deep .ng-select-container {
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  }
  .ng-select.custom ::ng-deep .ng-clear-wrapper {
    width: 0px;
    display: none;
  }
  .ng-select.ng-select-single.custom ::ng-deep .ng-value-container .ng-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: -10px;
  }
  .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: -5px;
  }
  .ng-select.custom ::ng-deep .ng-select-container .ng-value-container .ng-placeholder {
    margin-left: -11px;
  }
  .ng-select.ng-select-single.custom ::ng-deep .ng-select-container .ng-value-container .ng-input {
    top: 6px;
    left: 0;
    padding-left: 11px;
  }
  .mobile-withcountry .code {
    border: none;
    position: absolute;
    top: 36.5px;
    left: 3px;
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
  }`],
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
      doctorAddress: [this.list[0].address ? this.list[0].address.replace(/\s+/g, ' ').trim() : ''],
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
