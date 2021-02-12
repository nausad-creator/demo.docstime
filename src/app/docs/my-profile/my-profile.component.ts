import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';
import { DocsService } from '../docs.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyProfileComponent implements OnInit {
  docData: any;
  url: string;
  maxSize = 2048000;
  baseUrl = `${environment.apiBaseUrl}/backend/web/uploads`;
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
    private docService: DocsService,
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.docData = this.service.getDocLocal() ? this.service.getDocLocal() : this.service.getDocSession();
    this.url = `${this.baseUrl}/doctor/${this.docData.doctorProfileImage}`;
    this.cd.markForCheck();
    // form Data
    this.basicProfile = this.fb.group({
      doctorFullName: [this.docData.doctorFullName ? this.docData.doctorFullName : '',
      Validators.compose([Validators.required])],
      doctorEmail: [this.docData.doctorEmail ? this.docData.doctorEmail : '', Validators.compose([Validators.required,
      Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
      ])],
      doctorDOB: [this.docData.doctorDOB ? this.docData.doctorDOB : '', Validators.compose([])],
      doctorFax: [this.docData.doctorFax ? this.docData.doctorFax : '', Validators.compose([Validators.required])],
      doctorGender: [this.docData.doctorGender ? this.docData.doctorGender : '',
      Validators.compose([Validators.required])],
      doctorAbout: [this.docData.doctorAbout ? this.docData.doctorAbout : ''],
      doctorAddress: [this.docData.doctorAddress ? this.docData.doctorAddress : ''],
      doctorProfileImage: [this.docData.doctorProfileImage ? this.docData.doctorProfileImage : ''],
      doctorFirstName: [this.docData.doctorFirstName ? this.docData.doctorFirstName : ''],
      doctorLastName: [this.docData.doctorLastName ? this.docData.doctorLastName : ''],
      doctorMobile: [this.docData.doctorMobile ? this.docData.doctorMobile : '', Validators.compose([Validators.required,
      Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')
      ])],
      userCountryCode: [this.countryCodeOptions[0].code, Validators.compose([
        Validators.required
      ])],
    });
    this.profProfile = this.fb.group({
      specialityIDs: [this.docData.specialityIDs && this.docData.specialityIDs !== 'undefined' && this.docData.specialityIDs !== '0' ?
        this.docData.specialityIDs : null, Validators.compose([Validators.required])],
      degreeID: [this.docData.degreeID && this.docData.degreeID !== 'undefined' && this.docData.degreeID !== '0' ?
        this.docData.degreeID : null, Validators.compose([Validators.required])],
      doctorNPI: [this.docData.doctorNPI ? this.docData.doctorNPI : ''],
      facilityName: [this.docData.facilityName ? this.docData.facilityName : ''],
      facility: [this.docData.facility.length > 0 ? this.convertFacilityString(this.docData.facility) : '']
    });
    // get data
    this.degreeList$ = this.service.getDegrees;
    this.specialityList$ = this.service.getSpecility;
    this.cd.markForCheck();
  }

  onRemove = ($event: any) => {
    console.log($event);
  }
  onChangeCode = (code: string) => {
    this.flag = this.countryCodeOptions.filter((data) => data.code === code)[0].flag;
  }

  onUpdateBasicClick = (post: any) => {
    post.doctorProfileImage = this.service.getDocLocal() ? this.service.getDocLocal().doctorProfileImage :
      this.service.getDocSession().doctorProfileImage;
    this.updateDocProfile(post).then((response: Array<any>) => {
      if (response.length > 0) {
        this.service.getDocLocal() ? this.service.setDocLocal(JSON.stringify(response[0]))
          : this.service.setDocSession(JSON.stringify(response[0]));
        setTimeout(() => {
          this.spinner.hide();
          this.ngOnInit();
          this.cd.markForCheck();
          this.service.nextCount(response[0].doctorFullName);
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
  onUpdateProfessionalClick = (post: any) => {
    post.doctorProfileImage = this.service.getDocLocal() ? this.service.getDocLocal().doctorProfileImage :
      this.service.getDocSession().doctorProfileImage;
    this.updateDocProfile(post).then((response: Array<any>) => {
      if (response.length > 0) {
        this.service.getDocLocal() ? this.service.setDocLocal(JSON.stringify(response[0]))
          : this.service.setDocSession(JSON.stringify(response[0]));
        setTimeout(() => {
          this.spinner.hide();
          this.ngOnInit();
          this.cd.markForCheck();
          this.service.nextCount('prof-updated');
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

  updateDocProfile = (post: any) => {
    return new Promise((resolve, reject) => {
      this.markFormTouched(this.basicProfile && this.profProfile);
      const invalidinputBaic = this.findInvalidControlsBasic();
      const invalidinputPro = this.findInvalidControlsProf();
      if (this.basicProfile.valid && this.profProfile.valid && invalidinputBaic.length === 0 && invalidinputPro.length === 0) {
        this.spinner.show();
        const data = {
          languageID: '1',
          logindoctorID: this.docData.doctorID,
          doctorDOB: this.basicProfile.get('doctorDOB').value ?
          moment(this.basicProfile.get('doctorDOB').value).format('YYYY-MM-DD') : '',
          doctorFullName: post.doctorFullName ? post.doctorFullName : this.basicProfile.get('doctorFullName').value,
          doctorEmail: post.doctorEmail ? post.doctorEmail : this.basicProfile.get('doctorEmail').value,
          doctorMobile: post.doctorMobile ? post.doctorMobile : this.basicProfile.get('doctorMobile').value,
          doctorFirstName: post.doctorFirstName ? post.doctorFirstName : this.basicProfile.get('doctorFirstName').value,
          doctorLastName: post.doctorLastName ? post.doctorLastName : this.basicProfile.get('doctorLastName').value,
          specialityIDs: post.specialityIDs ? post.specialityIDs : this.profProfile.get('specialityIDs').value,
          doctorGender: post.doctorGender ? post.doctorGender : this.basicProfile.get('doctorGender').value,
          doctorFax: post.doctorFax ? post.doctorFax : this.basicProfile.get('doctorFax').value,
          doctorProfileImage: post.doctorProfileImage ? post.doctorProfileImage : this.basicProfile.get('doctorProfileImage').value,
          degreeID: post.degreeID ? post.degreeID : this.profProfile.get('degreeID').value,
          doctorAbout: post.doctorAbout ? post.doctorAbout : this.basicProfile.get('doctorAbout').value,
          doctorAddress: post.doctorAddress ? post.doctorAddress : this.basicProfile.get('doctorAddress').value,
        };
        this.docService.docUpdateProfile(JSON.stringify(data)).subscribe(
          (response) => {
            if (response[0].status === 'true') {
              resolve(response[0].data);
            } else {
              resolve([]);
            }
          }, error => reject(error)
        );
      }
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
  convertFacilityString = (post: Array<any>) => {
    const facilityNames = post.map(faci => faci.facilityName);
    const filtered = facilityNames.filter(names => names);
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
  onSelectFile = async (event: any) => {
    if (event.target.files.length > 0) {
      this.spinner.show();
      if (event.target.files[0].size <= this.maxSize) {
        this.selectedFiles = event.target.files[0] as File;
        await this.uploadFiles(this.selectedFiles)
          .then((fulFilled) => {
            const reader = new FileReader();
            reader.readAsDataURL(this.selectedFiles);
            reader.onload = () => {
            this.url = reader.result as string;
            this.cd.markForCheck();
          };
            this.updateLogo(fulFilled[0].fileName);
          })
          .catch((error) => {
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
        filePath: 'doctor',
        logindoctorID: this.docData.doctorID,
      };
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
    });
  }

  updateLogo = (doctorProfileImage: string) => {
    const data = {
      languageID: '1',
      logindoctorID: this.docData.doctorID,
      doctorProfileImage,
    };
    this.docService.updateProfilePic(JSON.stringify(data)).subscribe((response) => {
      if (response[0].status === 'true') {
        this.docData = response[0].data[0];
        this.service.getDocLocal() ? this.service.setDocLocal(JSON.stringify(response[0].data[0]))
        : this.service.setDocSession(JSON.stringify(response[0].data[0]));
        this.toastr.success('Profile Picture Updated');
        this.service.nextCount(response[0].data[0].doctorProfileImage);
        this.spinner.hide();
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
}
