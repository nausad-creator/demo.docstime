import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { HomeService } from 'src/app/home.service';
import { AddOrExistingDoctorModalComponent } from '../add-or-existing-doctor-modal/add-or-existing-doctor-modal.component';

@Component({
  selector: 'app-npi-modal',
  templateUrl: './npi-modal.component.html',
  styleUrls: ['./npi-modal.component.css']
})
export class NpiModalComponent implements OnInit {
  npiForm: FormGroup;
  error: string;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(
    private service: HomeService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private bsModalRef: BsModalRef  ) {
    // for NPI
    this.npiForm = this.fb.group({
      npi: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{10}$')])],
    });
  }

  ngOnInit(): void {
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
  openNewDoctor = (post: any) => {
    const initialState = {
      list: [{
        status: 'addDoctor',
        fullName: `${post.results[0].basic.first_name} ${post.results[0].basic.last_name}`,
        first_name: `${post.results[0].basic.first_name}`,
        last_name: `${post.results[0].basic.last_name}`,
        email: '',
        contact: post.results[0].addresses[0].telephone_number ? post.results[0].addresses[0].telephone_number.join('') : '',
        address: `${post.results[0].addresses[0].address_1}, ${post.results[0].addresses[0].city}, ${post.results[0].addresses[0].postal_code.substring(0, 5)}`,
        gender: `${post.results[0].basic.gender === 'M' ? 'Male' : 'Female'}`,
        npiNumber: `${post.results[0].number}`,
        faxNumber: `${post.results[0].addresses[0].fax_number ? post.results[0].addresses[0].fax_number.join('') : ''}`,
        profile: '',
        docaddressAddress: `${post.results[0].addresses[0].address_1}, ${post.results[0].addresses[0].city}, ${post.results[0].addresses[0].postal_code.substring(0, 5)}`,
        docaddressFaxNo: `${post.results[0].addresses[0].fax_number ? post.results[0].addresses[0].fax_number.join('') : ''}`,
        countryName: `${post.results[0].addresses[0].country_name}`,
        stateName: `${post.results[0].addresses[0].state}`,
        cityName: `${post.results[0].addresses[0].city}`,
        areaName: `${post.results[0].addresses[0].address_1}`,
        docaddressContactNo: post.results[0].addresses[0].telephone_number ? post.results[0].addresses[0].telephone_number.join('') : '',
        docaddressPincode: `${post.results[0].addresses[0].postal_code.substring(0, 5)}`,
      }]
    };
    this.bsModalRef = this.modalService.show(AddOrExistingDoctorModalComponent, { id: 543, initialState });
  }
  openExistingDoctor = (post: any) => {
    const initialState = {
      list: [{
        status: 'editDoctor',
        fullName: `${post[0].doctorFullName ? post[0].doctorFullName : ''}`,
        first_name: `${post[0].doctorFirstName ? post[0].doctorFirstName : ''}`,
        last_name: `${post[0].doctorLastName ? post[0].doctorLastName : ''}`,
        email: `${post[0].doctorEmail ? post[0].doctorEmail : ''}`,
        contact: `${post[0].doctorMobile ? post[0].doctorMobile : ''}`,
        address: `${post[0].doctorAddress ? post[0].doctorAddress.replace('USA', '').trim() : ''}`,
        gender: `${post[0].doctorGender === 'Male' ? 'Male' : 'Female'}`,
        npiNumber: `${post[0].doctorNPI}`,
        doctorID: `${post[0].doctorID}`,
        specialityIDs: `${post[0].speciality.length > 0 ? post[0].speciality[0].specialityName : ''}`,
        degreeID: `${post[0].degreeName ? post[0].degreeName : ''}`,
        doctorDOB: `${post[0].doctorDOB ? post[0].doctorDOB : ''}`,
        faxNumber: `${post[0].doctorFax ? post[0].doctorFax : ''}`,
        profile: `${post[0].doctorProfileImage ? post[0].doctorProfileImage : ''}`,
        docaddressAddress: `${post[0].Address.length > 0 ? post[0].Address[0].docaddressAddress.replace('USA', '').trim() : ''}`,
        countryName: `${post[0].Address.length > 0 ? post[0].Address[0].countryName : ''}`,
        stateName: `${post[0].Address.length > 0 ? post[0].Address[0].stateName : ''}`,
        cityName: `${post[0].Address.length > 0 ? post[0].Address[0].city : ''}`,
        areaName: `${post[0].Address.length > 0 ? post[0].Address[0].areaName : ''}`,
        docaddressContactNo: `${post[0].Address.length > 0 ? post[0].Address[0].docaddressContactNo : ''}`,
        docaddressPincode: `${post[0].Address.length > 0 ? post[0].Address[0].docaddressPincode : ''}`,
        docaddressFaxNo: `${post[0].Address.length > 0 ? post[0].Address[0].docaddressFaxNo : ''}`,
      }]
    };
    this.bsModalRef = this.modalService.show(AddOrExistingDoctorModalComponent, { id: 543, initialState });
  }
  onSubmitNPI = (post: any) => {
    this.markFormTouched(this.npiForm);
    if (this.npiForm.valid) {
      this.error = '';
      const data = {
        loginuserID: '0',
        languageID: '1',
        facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
        npiNumber: post.npi,
      };
      this.getNPI(JSON.stringify(data)).then((response) => {
        switch (response[0].flag) {
          case '0': if (response[0].data.results.length === 0) {
            this.error = `Enter valid NPI`;
            this.spinner.hide();
            break;
          } else {
            this.modalService.hide();
            this.npiForm.reset();
            setTimeout(() => {
              this.spinner.hide();
              response[0].data.results[0].addresses[0].telephone_number =
              response[0].data.results[0].addresses[0].telephone_number ?
              response[0].data.results[0].addresses[0].telephone_number.split('-') : '';
              response[0].data.results[0].addresses[0].fax_number =
              response[0].data.results[0].addresses[0].fax_number ?
              response[0].data.results[0].addresses[0].fax_number.split('-') : '';
              this.openNewDoctor(response[0].data);
            }, 500);
            break;
          }
          case '2': this.modalService.hide();
                    this.npiForm.reset();
                    setTimeout(() => {
                    this.spinner.hide();
                    this.openExistingDoctor(response[0].data);
            }, 500);
                    break;
          case '1': this.error = response[0].message;
                    this.spinner.hide();
                    break;
          case '3': this.error = response[0].message;
                    this.spinner.hide();
                    break;
          case '4': this.error = response[0].message;
                    this.spinner.hide();
                    break;
          case '5': this.error = response[0].message;
                    this.spinner.hide();
                    break;
          default:  this.error = response[0].message;
                    this.spinner.hide();
                    break;
        }
        setTimeout(() => {this.error = ''; }, 5000);
      }).catch((error) => {
        this.error = error;
        console.error(error);
        this.spinner.hide();
      });
    }
  }
 getNPI = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.service.getNPIinfo(post).subscribe((response) => resolve(response), () => reject('some error occured, please try again later'));
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
}
