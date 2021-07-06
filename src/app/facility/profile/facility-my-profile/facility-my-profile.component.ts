import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';
import { environment } from 'src/environments/environment';
import { FacilityService } from '../../facility.service';
import { VerificationComponent } from './verification/verification.component';
interface ChangeEmailMobile {
  facilityuserID: string;
  changeFacilityuserMobile: string;
  changeFacilityuserEmail: string;
  changeFacilityuserOldMobile: string;
  changeFacilityuserOldEmail: string;
}
@Component({
  selector: 'app-facility-my-profile',
  template: `<body class="dashbord-section">
  <div class="spacetop"></div>
  <section class="section-dashbord">
    <div class="container">
      <div class="title-dashbord d-flex pt-3 pb-3">
        <h4 class="text-dark mb-0">My Profile</h4>
      </div>

      <div class="card p-3">
        <div class=" appointment-conten ">
          <ul class="nav nav-tabs custom-tabs border-0" id="myTab" role="tablist">
            <li class="nav-item"><a class="nav-link active" id="home-tab" data-toggle="tab" href="#Personal" role="tab"
                aria-controls="Upcoming" aria-selected="true">Profile</a></li>
            <li class="nav-item"><a class="nav-link" id="profile-tab" data-toggle="tab" href="#Professional" role="tab"
                aria-controls="profile" aria-selected="false">Facility Info</a></li>
          </ul>
          <hr>

          <div class="tab-content pt-3" id="myTabContent">
            <div class="tab-pane fade show active" id="Personal" role="tabpanel" aria-labelledby="home-tab">
              <div class="">
                <form class="text-left profile-form" [formGroup]="basicProfile">
                  <div class="row">
                    <div class="col-lg-3 col-md-12">
                      <div class="fi-profile-photo">
                        <span class="imagebox cursr"><label for="photoupload">
                          <img id="blah-b" class="cursr" [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="url" [errorImage]="'assets/img/user-icon.png'" alt=""></label></span>
                        <label for="photoupload" class="fi-custom-upladfile cursr">
                          <input (change)="onSelectFile($event)" multiple="" accept="image/*" id="photoupload"
                            name="photoupload" type="file"><span class="photoupload-link cursr">Upload Photo</span>
                        </label>
                      </div>
                    </div>
                    <div class="col-lg-9 col-md-12 align-self-center">
                      <div class="row">
                        <div class="form-group col-md-4">
                          <label>Name<span class="required-field"></span></label>
                          <input type="text" id="defaultName" formControlName="facilityFullName" name="facilityFullName"
                            class="form-control" placeholder="Enter Name" value="" readonly>
                        </div>
                        <div class="form-group col-md-4">
                          <label>Facility Name<span class="required-field"></span></label>
                          <input type="text" id="facilityName" formControlName="facilityName" name="facilityName"
                            class="form-control" placeholder="Facility Name" required>
                            <small class="text-danger small"
                            *ngIf="basicProfile.controls['facilityName'].hasError('required') && (basicProfile.controls['facilityName'].dirty || basicProfile.controls['facilityName'].touched)">Please
                            enter facility name.</small>
                        </div>
                        <div class="form-group col-md-4">
                          <label>Email Address<span class="required-field"></span></label>
                          <input type="email" id="EmailAddress" formControlName="facilityuserEmail"
                            name="facilityuserEmail" placeholder="Enter email" class="form-control" value="">
                          <small class="text-danger small"
                            *ngIf="basicProfile.controls['facilityuserEmail'].hasError('pattern') && (basicProfile.controls['facilityuserEmail'].dirty || basicProfile.controls['facilityuserEmail'].touched )">Please
                            enter valid Email ID</small>
                          <small class="text-danger small"
                            *ngIf="basicProfile.controls['facilityuserEmail'].hasError('required') && (basicProfile.controls['facilityuserEmail'].dirty || basicProfile.controls['facilityuserEmail'].touched)">Please
                            enter Email ID</small>
                        </div>
                        <div class="form-group col-md-4">
                          <label>Mobile Number<span class="required-field"></span></label>
                          <input type="text" id="MobileNumber" mask="(000) 000-0000" maxlength="14"
                            formControlName="facilityuserMobile" name="facilityuserMobile"
                            placeholder="Enter mobile number" class="form-control" value="">
                          <small class="text-danger small"
                            *ngIf="basicProfile.controls['facilityuserMobile'].hasError('required') && (basicProfile.controls['facilityuserMobile'].dirty || basicProfile.controls['facilityuserMobile'].touched)">Please
                            enter mobile number</small>
                          <small class="text-danger small" *ngIf="basicProfile.controls.facilityuserMobile.errors">{{basicProfile.controls.facilityuserMobile.errors.message}}</small>
                        </div>
                        <div class="form-group col-md-4">
                          <label>Fax Number<span class="required-field"></span></label>
                          <input type="text" id="facilityFax" mask="(000) 000-0000" maxlength="14"
                            formControlName="facilityFax" name="facilityFax"
                            placeholder="Enter fax-number" class="form-control">
                          <small class="text-danger small"
                            *ngIf="basicProfile.controls['facilityFax'].hasError('required') && (basicProfile.controls['facilityFax'].dirty || basicProfile.controls['facilityFax'].touched)">Please
                            enter fax.</small>
                          <small class="text-danger small" *ngIf="basicProfile.controls.facilityFax.errors">{{basicProfile.controls.facilityFax.errors.message}}</small>
                        </div>
                        <div class="form-group col-md-4">
                          <label class="active">Gender<span class="required-field"></span></label>
                          <input type="text" id="facilityuserGender" formControlName="facilityuserGender"
                            placeholder="Enter fax-number" name="facilityuserGender" class="form-control" value="" readonly>
                          <small class="text-danger small"
                            *ngIf="basicProfile.controls['facilityuserGender'].hasError('required') && (basicProfile.controls['facilityuserGender'].dirty || basicProfile.controls['facilityuserGender'].touched)">Please
                            Enter Gender.</small>
                        </div>
                        <div class="form-group col-md-12">
                          <label>About Facility</label>
                          <textarea type="text" placeholder="About...?" formControlName="facilityAbout" name="facilityAbout"
                            id="facilityAbout" class="form-control"></textarea>
                        </div>
                      </div>
                      <div class="regerv_btn"><a (click)="onUpdateBasicClick(basicProfile.value)"
                          class="btn btn-primary cursr">Update</a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div class="tab-pane fade" id="Professional" role="tabpanel" aria-labelledby="profile-tab">
              <div class="">
                <form class="text-left profile-form" [formGroup]="profProfile">
                  <div class="row">
                    <div class="col-lg-12 col-md-12 align-self-center">
                      <div class="row">
                        <div class="form-group col-lg-4 col-md-6">
                          <label>Name<span class="required-field"></span></label>
                          <input type="text" id="nipi" placeholder="Enter Name" formControlName="facilityName" name="facilityName"
                            class="form-control">
                          <small class="text-danger small"
                            *ngIf="profProfile.controls['facilityName'].hasError('required') && (profProfile.controls['facilityName'].dirty || profProfile.controls['facilityName'].touched)">Please
                            enter name.</small>
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                          <label>Email Address<span class="required-field"></span></label>
                          <input type="text" id="primaryID" formControlName="facilityEmail" name="facilityEmail"
                            placeholder="Enter facility Email" class="form-control" value="">
                          <small class="text-danger small"
                            *ngIf="profProfile.controls['facilityEmail'].hasError('pattern') && (profProfile.controls['facilityEmail'].dirty || profProfile.controls['facilityEmail'].touched )">Please
                            enter valid email.</small>
                          <small class="text-danger small"
                            *ngIf="profProfile.controls['facilityEmail'].hasError('required') && (profProfile.controls['facilityEmail'].dirty || profProfile.controls['facilityEmail'].touched)">Please
                            enter email.</small>
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                          <label>Mobile Number<span class="required-field"></span></label>
                          <input type="text" id="secondaryID" mask="(000) 000-0000" maxlength="14" formControlName="facilityContactNumber"
                            name="facilityContactNumber" placeholder="Enter Mobile number" class="form-control">
                          <small class="text-danger small"
                            *ngIf="profProfile.controls['facilityContactNumber'].hasError('required') && (profProfile.controls['facilityContactNumber'].dirty || profProfile.controls['facilityContactNumber'].touched)">Please
                            enter mobile number</small>
                          <small class="text-danger small" *ngIf="profProfile.controls.facilityContactNumber.errors">{{profProfile.controls.facilityContactNumber.errors.message}}</small>
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                          <label>Speciality<span class="required-field"></span></label>
                          <input type="text" id="secondaryID" formControlName="facilitypeciality"
                            name="facilitypeciality" placeholder="Enter Speciality number" class="form-control"
                            value="" readonly>
                        </div>
                        <div class="form-group col-lg-4 col-md-6">
                          <label>Address<span class="required-field"></span></label>
                          <input type="text" id="secondaryID" formControlName="facilityAddress" name="facilityAddress"
                            placeholder="Enter facility Address" class="form-control" value="">
                          <small class="text-danger small"
                            *ngIf="profProfile.controls['facilityAddress'].hasError('required') && (profProfile.controls['facilityAddress'].dirty || profProfile.controls['facilityAddress'].touched)">Please
                            Enter Address.</small>
                        </div>
                      </div>
                      <div class="regerv_btn" style="margin-top: 10px;"><a
                          (click)="onUpdateProfessionalClick(profProfile.value)"
                          class="btn btn-primary cursr">Update</a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <br>
</body>`,
  styles: [`.cursr{
    cursor: pointer;
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
    transition: border-color .15s ease-in-out,box-
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
  .required-field::before {
    content: "*";
    color: red;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityMyProfileComponent implements OnInit {
  bsModalRef: BsModalRef;
  maxDate = new Date();
  facData: any;
  url: string;
  maxSize = 2048000;
  baseUrl = `${environment.fileUrl}`;
  selectedFiles: File;
  basicProfile: FormGroup;
  profProfile: FormGroup;
  // observable
  degreeList$: Observable<Array<any>>;
  specialityList$: Observable<Array<any>>;
  countryCodeOptions = [
    { code: '+91', flag: 'assets/img/flag_india_1.png' },
    { code: '+129', flag: 'assets/img/flag_uae_1.png' },
    { code: '+65', flag: 'assets/img/flag_usa_1.png' }
  ];
  flag = 'assets/img/flag_india_1.png'; // default
  constructor(
    private facilityService: FacilityService,
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private modalService: BsModalService
  ) { }
  customValidatorUSnumber(control: AbstractControl): ValidationErrors {
    const error = {
      name: '',
      message: ''
    };
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (control.value !== '') {
      if (!phoneRegex.test(control.value)) {
        error.name = 'invalidPhone';
        error.message = 'Mobile number must be only 10 digit.';
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
  ngOnInit(): void {
    this.facData = this.service.getFaLocal() ? this.service.getFaLocal() : this.service.getFaSession();
    this.url = `${this.baseUrl}/facilityuser/${this.facData.facilityuserImage}`;
    this.cd.markForCheck();
    // form Data
    this.basicProfile = this.fb.group({
      facilityFullName: [`${this.facData.facilityuserFirstName} ${this.facData.facilityuserLastName}`],
      facilityName: [this.facData.facilityName ? this.facData.facilityName : '', Validators.compose([Validators.required])],
      facilityuserEmail: [this.facData.facilityuserEmail ? this.facData.facilityuserEmail : '', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      facilityuserDOB: [this.facData.facilityuserDOB ? this.facData.facilityuserDOB : '', Validators.compose([Validators.required])],
      facilityAbout: [this.facData.facilityAbout ? this.facData.facilityAbout : ''],
      facilityuserGender: [this.facData.facilityuserGender ? this.facData.facilityuserGender : '', Validators.compose([Validators.required])],
      facilityuserImage: [this.facData.facilityuserImage ? this.facData.facilityuserImage : ''],
      facilityuserFirstName: [this.facData.facilityuserFirstName ? this.facData.facilityuserFirstName : ''],
      facilityuserLastName: [this.facData.facilityuserLastName ? this.facData.facilityuserLastName : ''],
      facilityuserMobile: [this.facData.facilityuserMobile ? this.facData.facilityuserMobile : '', Validators.compose([Validators.required, this.customValidatorUSnumber])],
      facilityFax: [this.facData.facilityFax ? this.facData.facilityFax : '', Validators.compose([Validators.required, this.customValidatorUSFAXnumber])],
      userCountryCode: [this.countryCodeOptions[0].code, Validators.compose([Validators.required])],
    });
    this.profProfile = this.fb.group({
      facilityContactNumber: [this.facData.facilityContactNumber ? this.facData.facilityContactNumber : '', Validators.compose([Validators.required, this.customValidatorUSnumber])],
      userCountryCode: [this.countryCodeOptions[0].code, Validators.compose([Validators.required])],
      facilityEmail: [this.facData.facilityEmail ? this.facData.facilityEmail : '', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      facilityAddress: [this.facData.facilityAddress ? this.facData.facilityAddress : '', Validators.compose([Validators.required])],
      facilityName: [this.facData.facilityName ? this.facData.facilityName : '', Validators.compose([Validators.required])],
      facilitypeciality: [this.facData.facilitypeciality.length > 0 ? this.convertSpecialityString(this.facData.facilitypeciality) : '']
    });
    this.cd.markForCheck();
  }
  onChangeCode = (code: string) => {
    this.flag = this.countryCodeOptions.filter((data) => data.code === code)[0].flag;
  }
  onUpdateBasicClick = (post: any) => {
    this.markFormTouched(this.basicProfile);
    if (this.basicProfile.valid && this.profProfile.valid && this.findInvalidControlsBasic().length === 0) {
      if (post.facilityuserEmail !== this.facData.facilityuserEmail || post.facilityuserMobile.match(/\d/g).join('') !== this.facData.facilityuserMobile.match(/\d/g).join('')) {
        this.onVerifyChange();
      } else {
        this.updateBasic(post);
      }
    }
  }
  updateBasic = (post: any) => {
    this.markFormTouched(this.basicProfile);
    if (this.basicProfile.valid && this.profProfile.valid && this.findInvalidControlsBasic().length === 0) {
      this.updateFacilityProfile(post).then((response: Array<any>) => {
        if (response.length > 0) {
          this.service.getFaLocal() ? this.service.setFaLocal(JSON.stringify(response[0])) : this.service.setFaSession(JSON.stringify(response[0]));
          setTimeout(() => {
            this.spinner.hide();
            this.ngOnInit();
            this.service.nextCount(`${response[0].facilityuserFirstName} ${response[0].facilityuserLastName}`);
            this.toastr.success('Profile updated successfully');
          }, 500);
        } else {
          this.spinner.hide();
          this.toastr.error('some error occured, please try again later');
        }
      }).catch((error) => {
        console.error(error);
        this.spinner.hide();
        this.toastr.error('some error occured, please try again later');
      });
    }
  }
  onUpdateProfessionalClick = (post: any) => {
    this.markFormTouched(this.profProfile);
    if (this.profProfile.valid && this.findInvalidControlsProf().length === 0) {
      this.updateFacilityInfo(post).then((response: Array<any>) => {
        if (response.length > 0) {
          this.service.getFaLocal() ? this.service.setFaLocal(JSON.stringify(response[0])) : this.service.setFaSession(JSON.stringify(response[0]));
          setTimeout(() => {
            this.spinner.hide();
            this.ngOnInit();
            this.service.nextCount(`${response[0].facilityName}`);
            this.toastr.success('Profile updated successfully', '', {
              positionClass: 'toast-center-center',
              timeOut: 1500
            });
          });
        } else {
          this.spinner.hide();
          this.toastr.error('some error occured, please try again later');
        }
      }).catch((error) => {
        console.error(error);
        this.spinner.hide();
        this.toastr.error('some error occured, please try again later');
      });
    }
  }
  updateFacilityProfile = (post: any) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        facilityuserID: this.facData.facilityuserID,
        facilityName: post.facilityName ? post.facilityName : this.basicProfile.get('facilityName').value,
        facilityAbout: post.facilityAbout ? post.facilityAbout : this.basicProfile.get('facilityAbout').value,
        facilityuserDOB: post.facilityuserDOB ? moment(post.facilityuserDOB).format('YYYY-MM-DD') : moment(this.basicProfile.get('facilityuserDOB').value).format('YYYY-MM-DD'),
        facilityuserEmail: post.facilityuserEmail ? post.facilityuserEmail : this.basicProfile.get('facilityuserEmail').value,
        facilityuserMobile: post.facilityuserMobile ? post.facilityuserMobile.match(/\d/g).join('') : this.basicProfile.get('facilityuserMobile').value.match(/\d/g).join(''),
        facilityuserFax: post.facilityFax ? post.facilityFax.match(/\d/g).join('') : this.basicProfile.get('facilityFax').value.match(/\d/g).join(''),
        facilityuserFirstName: post.facilityuserFirstName ? post.facilityuserFirstName : this.basicProfile.get('facilityuserFirstName').value,
        facilityuserImage: this.service.getFaLocal() ? this.service.getFaLocal().facilityuserImage : this.service.getFaSession().facilityuserImage,
        facilityuserLastName: post.facilityuserLastName ? post.facilityuserLastName : this.basicProfile.get('facilityuserLastName').value,
        facilityuserGender: post.facilityuserGender ? post.facilityuserGender : this.basicProfile.get('facilityuserGender').value,
      };
      this.facilityService.updateProfile(JSON.stringify(data)).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        }, error => reject(error)
      );
    });
  }
  updateFacilityInfo = (post: any) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        facilityuserID: this.facData.facilityuserID,
        facilityName: post.facilityName ? post.facilityName : this.profProfile.get('facilityName').value,
        facilityEmail: post.facilityEmail ? post.facilityEmail : this.profProfile.get('facilityEmail').value,
        facilityContactNumber: post.facilityContactNumber ? post.facilityContactNumber.match(/\d/g).join('') : this.profProfile.get('facilityContactNumber').value.match(/\d/g).join(''),
        facilityAddress: post.facilityAddress ? post.facilityAddress : this.profProfile.get('facilityAddress').value,
      };
      this.facilityService.updateInfo(JSON.stringify(data)).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        }, error => reject(error)
      );
    });
  }

  findInvalidControlsBasic = () => {
    const invalid = [];
    const controls = this.basicProfile.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  findInvalidControlsProf = () => {
    const invalid = [];
    const controls = this.profProfile.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  convertSpecialityString = (post: Array<any>) => {
    const specialityName = post.map(faci => faci.specialityName);
    const filtered = specialityName.filter(names => names);
    return filtered.join(', ');
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
  onSelectFile = async (event: Event) => {
    if ((event.target as HTMLInputElement).files.length > 0) {
      this.spinner.show();
      if ((event.target as HTMLInputElement).files[0].size <= this.maxSize) {
        this.selectedFiles = (event.target as HTMLInputElement).files[0] as File;
        await this.uploadFiles(this.selectedFiles).then((fulFilled) => {
            const reader = new FileReader();
            reader.readAsDataURL(this.selectedFiles);
            reader.onload = () => {
              this.url = reader.result as string;
              this.cd.markForCheck();
            };
            this.updateLogo(fulFilled[0].fileName);
          }).catch((error) => {
            this.spinner.hide();
            console.error(error);
          });
      } else {
        this.spinner.hide();
        this.toastr.warning('File size Should not be more than 2 MB');
      }
    }
  }
  uploadFiles = (file: File) => {
    return new Promise((resolve, reject) => {
      const data = {
        file,
        fileName: file.name,
        filePath: 'facilityuser',
        logindoctorID: this.facData.facilityuserID,
      };
      this.facilityService.uploadFile(data).subscribe((response) => {
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
    });
  }
  updateLogo = (facilityuserImage: string) => {
    const data = {
      languageID: '1',
      facilityuserID: this.facData.facilityuserID,
      facilityuserImage,
    };
    this.facilityService.updateProfilePic(JSON.stringify(data)).subscribe((response) => {
      if (response[0].status === 'true') {
        this.facData = response[0].data[0];
        this.service.getFaLocal() ? this.service.setFaLocal(JSON.stringify(response[0].data[0])) : this.service.setFaSession(JSON.stringify(response[0].data[0]));
        this.toastr.success('Profile Picture Updated');
        setTimeout(() => { this.service.nextCount(`${response[0].data[0].facilityuserImage}`); });
        this.spinner.hide();
        this.cd.markForCheck();
      } else {
        this.spinner.hide();
        this.toastr.error(response[0].message, 'error');
      }
    },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }
  onVerifyChange = () => {
    this.spinner.show();
    const data: ChangeEmailMobile = {
      facilityuserID: this.facData.facilityuserID,
      changeFacilityuserEmail: this.basicProfile.get('facilityuserEmail').value,
      changeFacilityuserMobile: this.basicProfile.get('facilityuserMobile').value.match(/\d/g).join(''),
      changeFacilityuserOldEmail: this.facData.facilityuserEmail,
      changeFacilityuserOldMobile: this.facData.facilityuserMobile.match(/\d/g).join(''),
    };
    this.verifyChange(JSON.stringify(data)).then((res: boolean) => {
        if (res) {
          this.openVerification(data);
        }
        if (!res) {
          this.toastr.error('Error occured, please try again later');
        }
      }).catch(err => console.error(err)).finally(() => this.spinner.hide());
  }
  verifyChange = (data: string) => {
    return new Promise((resolve, reject) => {
      this.facilityService.checkForChange(data).subscribe(
        res => {
          if (res[0].status === 'true') {
            resolve(true);
          }
          if (res[0].status === 'false') {
            resolve(false);
          }
        }, error => reject(error));
    });
  }
  openVerification = (res: ChangeEmailMobile) => {
    const initialState = {
      list: [{
        res
      }]
    };
    this.bsModalRef = this.modalService.show(VerificationComponent, { id: 274, initialState });
    this.bsModalRef.content.event.subscribe((response: string) => {
      const data = JSON.parse(response);
      if (data.res === 'confirmed') {
        this.updateBasic(this.basicProfile.value);
      }
    });
  }
}
