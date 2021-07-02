import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';
import { environment } from 'src/environments/environment';
import { FacilityService } from '../facility.service';
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
  templateUrl: './facility-my-profile.component.html',
  styleUrls: ['./facility-my-profile.component.css'],
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
