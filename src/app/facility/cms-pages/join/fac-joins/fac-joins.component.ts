import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';
import { LocationService } from 'src/app/location.service';

@Component({
  selector: 'app-fac-joins',
  templateUrl: './fac-joins.component.html',
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
    color: #838586;
    margin-left: -11px;
  }
  .ng-select.ng-select-single.custom ::ng-deep .ng-select-container .ng-value-container .ng-input {
    top: 6px;
    left: 0;
    padding-left: 11px;
  }
  .required-field::before {
    content: "*";
    color: red;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacJoinsComponent implements OnInit {
  joinUs: FormGroup;
  specialityList$: Observable<Array<any>>;
  options = {
    types: [],
    componentRestrictions: { country: 'USA' }
  };
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  constructor(
    public service: HomeService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private locService: LocationService,
  ) {
    this.joinUs = this.fb.group({
      joinName: [null, Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern('^[a-zA-Z \-\']+')])],
      joinEmail: [null, Validators.compose([Validators.required, Validators.
        pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      joinMobile: [null, Validators.compose([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')])],
      joinCity: ['', Validators.compose([Validators.required])],
      joinState: ['', Validators.compose([Validators.required])],
      joinZip: [null, Validators.compose([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{5}$')])],
      joinAddress: ['', Validators.compose([Validators.required])],
      joinMessage: ['', Validators.compose([Validators.required])],
      joinType: ['Doctor'],
      joinSpeciality: [null, Validators.compose([Validators.required])],
    });
  }
  ngOnInit(): void {
    this.getCurrentLocation();
    this.specialityList$ = this.service.getSpecility;
  }
  onSubmit = (post: any) => {
    this.markFormTouched(this.joinUs);
    if (this.joinUs.valid && this.findInvalidControls().length === 0) {
      const data = {
        joinName: post.joinName ? post.joinName.trim() : '',
        joinEmail: post.joinEmail ? post.joinEmail.trim() : '',
        joinMobile: post.joinMobile ? post.joinMobile.trim() : '',
        joinMessage: post.joinMessage ? post.joinMessage : '',
        joinSpeciality: post.joinSpeciality ? post.joinSpeciality : '',
        joinType: post.joinType ? post.joinType.trim() : '',
        joinLocation: post.joinAddress && post.joinZip && post.joinCity && post.joinState ?
          `${post.joinAddress.trim()}, ${post.joinZip.trim()}, ${post.joinCity.trim()}, ${post.joinState.trim()}` : '',
      };
      this.joinUS(JSON.stringify(data)).then(() => {
        setTimeout(() => {
          this.toastr.success('<h5>Thank you for contacting DocsTime.</h5>We will get back to you within 24 hrs.'
            , '', {
              positionClass: 'toast-center-center-join-us',
              timeOut: 5000,
              enableHtml : true,
             });
          this.joinUs.reset();
          setTimeout(() => {this.getCurrentLocation(); }, 500);
        }, 500);
      }).catch(() => this.toastr.error('Error', 'Some error occured, please try again later.')).finally(() => this.spinner.hide());
    }
  }
  joinUS = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.service.joinUS(post).subscribe(
        (res) => {
          if (res[0].status === 'true') {
            resolve(res[0].message);
          } else {
            reject(res[0].message);
          }
        }, () => reject('error'));
    });
  }
  findInvalidControls = () => {
    const invalid = [];
    const controls = this.joinUs.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
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
  getCurrentLocation = () => {
    this.locService.get().subscribe(
      (add: string) => {
        if (add !== 'Not found' && add !== null && add !== undefined && add !== '') {
          const formatted = add.split(', ');
          const zipState = formatted[formatted.length - 2].toString();
          const zipAndState = zipState ? zipState.split(' ') : '';
          this.joinUs.get('joinAddress').patchValue(`${formatted.length > 0 ? formatted[0] : ''}, ${formatted.length >= 1 ? formatted[1] : ''}`);
          this.joinUs.get('joinZip').patchValue(`${zipState ? zipAndState[1] : ''}`);
          this.joinUs.get('joinCity').patchValue(`${formatted[formatted.length - 3] ? formatted[formatted.length - 3] : ''}`);
          this.joinUs.get('joinState').patchValue(`${zipState ? zipAndState[0] : ''}`);
          this.cd.markForCheck();
        }
      }, err => console.error(err));
  }
  handleAddressChange = (address: Address) => {
    this.locService.getLocationFromLatLng(address.geometry.location.lat(), address.geometry.location.lng()).subscribe(
      (add: string) => {
        if (add !== 'Not found' && add !== null && add !== undefined && add !== '') {
          const formatted = add.split(', ');
          const selected = address.formatted_address.split(', ');
          const zipState = formatted[formatted.length - 2].toString();
          const zipAndState = zipState ? zipState.split(' ') : '';
          this.joinUs.get('joinAddress').patchValue(`${address.name ? `${address.name}, ${selected.length > 0 ? selected[0] : ''}` : address.formatted_address}`);
          this.joinUs.get('joinZip').patchValue(`${zipState ? zipAndState[1] : ''}`);
          this.joinUs.get('joinCity').patchValue(`${formatted[formatted.length - 3] ? formatted[formatted.length - 3] : ''}`);
          this.joinUs.get('joinState').patchValue(`${zipState ? zipAndState[0] : ''}`);
          this.cd.markForCheck();
        }
      }, err => console.error(err));
  }
}
