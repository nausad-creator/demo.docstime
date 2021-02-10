import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';
import { LocationService } from 'src/app/location.service';

@Component({
  selector: 'app-join-docs',
  template: `
  <!-- breadcrumb start-->
  <section class="breadcrumb breadcrumb_bg">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb_iner">
            <div class="breadcrumb_iner_item">
              <h2>Join DocsTime</h2>
              <!-- <p>Home<span>/</span>Join Docs Time</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- breadcrumb start-->
  <section class="contact-section section_padding">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-3">
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="regervation_part_iner">
            <form class="bootstrap-form needs-validation profile-form" [formGroup]="joinUs"
              (ngSubmit)="onSubmit(joinUs.value)">
              <!-- <h2>Join Us (DocsTime)</h2> -->
              <div class="form-row pt-3">
                <div class="form-group col-md-6">
                  <input type="text" id="signonname" oninput="this.value = this.value.replace(/^\s+/g, '')"
                    formControlName="joinName" class="form-control" name="signonname" autocomplete="off"
                    placeholder="Name*" required />
                  <small class="text-danger"
                    *ngIf="joinUs.controls['joinName'].hasError('required') && (joinUs.controls['joinName'].dirty || joinUs.controls['joinName'].touched)">Please
                    enter name.</small>
                  <small class="text-danger" *ngIf="joinUs.controls['joinName'].hasError('maxlength')">Input
                    fields will not be more than 40 characters.</small>
                  <small class="text-danger small"
                    *ngIf="joinUs.controls['joinName'].hasError('pattern') && (joinUs.controls['joinName'].dirty || joinUs.controls['joinName'].touched)">Only
                    Alphabets are allowed.</small>
                </div>
                <div class="form-group col-md-6">
                  <input type="email" id="emailid" oninput="this.value = this.value.replace(/^\s+/g, '')"
                    formControlName="joinEmail" class="form-control" name="email" autocomplete="off"
                    placeholder="Email address*" required />
                  <small class="text-danger"
                    *ngIf="joinUs.controls['joinEmail'].hasError('pattern') && (joinUs.controls['joinEmail'].dirty || joinUs.controls['joinEmail'].touched )">Please
                    enter valid email.</small>
                  <small class="text-danger small"
                    *ngIf="joinUs.controls['joinEmail'].hasError('required') && (joinUs.controls['joinEmail'].dirty || joinUs.controls['joinEmail'].touched)">Please
                    enter email.</small>
                </div>
                <div class="form-group col-md-6">
                  <ng-select
                  [closeOnSelect]="true"
                  appearance="outline"
                  [searchable]="true"
                  placeholder="Select speciality*"
                  formControlName="joinSpeciality"
                  class="custom"
                  name="specialityName">
                  <ng-option *ngFor="let spec of (specialityList$ | async)" [value]="spec.specialityName">
                      {{spec.specialityName}}</ng-option>
                  </ng-select>
                  <small class="text-danger small"
                  *ngIf="joinUs.controls['joinSpeciality'].hasError('required') && (joinUs.controls['joinSpeciality'].dirty || joinUs.controls['joinSpeciality'].touched)">Please
                    Select speciality.</small>
                </div>
                <div class="form-group col-md-6">
                  <input type="text" id="mobile" oninput="this.value = this.value.replace(/^\s+/g, '')"
                    formControlName="joinMobile" maxlength="10" class="form-control" name="mobile" autocomplete="off"
                    placeholder="Phone number*" required />
                  <small class="text-danger small"
                    *ngIf=" joinUs.controls['joinMobile'].hasError('required') && (joinUs.controls['joinMobile'].dirty || joinUs.controls['joinMobile'].touched)">Please
                    enter Phone number.</small>
                  <small class="text-danger small"
                    *ngIf="joinUs.controls['joinMobile'].hasError('pattern') && (joinUs.controls['joinMobile'].dirty || joinUs.controls['joinMobile'].touched)">Phone
                    number must be only 10 digits.</small>
                </div>
                <div class="form-group col-md-6">
                  <input class="form-control pac-target-input" oninput="this.value = this.value.replace(/^\s+/g, '')"
                    formControlName="joinAddress" name="address" id="autoGoogle" type="text" placeholder="Address*"
                    ngx-google-places-autocomplete [options]='options' #placesRef="ngx-places" (onAddressChange)="handleAddressChange($event)">
                  <small class="text-danger"
                    *ngIf="joinUs.controls['joinAddress'].hasError('required') && (joinUs.controls['joinAddress'].dirty || joinUs.controls['joinAddress'].touched)">Please
                    enter address.</small>
                </div>
                <div class="form-group col-md-6">
                  <input class="form-control pac-target-input" oninput="this.value = this.value.replace(/^\s+/g, '')"
                    formControlName="joinCity" name="address" id="city" type="text" placeholder="City*"
                    autocomplete="off">
                  <small class="text-danger"
                    *ngIf="joinUs.controls['joinCity'].hasError('required') && (joinUs.controls['joinCity'].dirty || joinUs.controls['joinCity'].touched)">Please
                    enter city.</small>
                </div>
                <div class="form-group col-md-6">
                  <input class="form-control pac-target-input" oninput="this.value = this.value.replace(/^\s+/g, '')"
                    formControlName="joinState" name="address" id="state" type="text" placeholder="State*"
                    autocomplete="off">
                  <small class="text-danger"
                    *ngIf="joinUs.controls['joinState'].hasError('required') && (joinUs.controls['joinState'].dirty || joinUs.controls['joinState'].touched)">Please
                    enter state.</small>
                </div>
                <div class="form-group col-md-6">
                  <input class="form-control pac-target-input" maxlength="5"
                    oninput="this.value = this.value.replace(/^\s+/g, '')" formControlName="joinZip" name="address"
                    id="zipc" type="text" placeholder="Zip code*" autocomplete="off">
                  <small class="text-danger"
                    *ngIf="joinUs.controls['joinZip'].hasError('required') && (joinUs.controls['joinZip'].dirty || joinUs.controls['joinZip'].touched)">Please
                    enter zip code.</small>
                  <small class="text-danger small"
                    *ngIf="joinUs.controls['joinZip'].hasError('pattern') && (joinUs.controls['joinZip'].dirty || joinUs.controls['joinZip'].touched)">zip code must be 5 digits.</small>
                </div>
                <div class="form-group col-md-12 col-lg-12">
                  <textarea class="form-control" id="Textarea" rows="4" name="joinMessage" formControlName="joinMessage"
                    placeholder="Message" requiresd></textarea>
                    <small class="text-danger"
                    *ngIf="joinUs.controls['joinMessage'].hasError('required') && (joinUs.controls['joinMessage'].dirty || joinUs.controls['joinMessage'].touched)">Please
                    enter message.</small>
                </div>
              </div>
              <div class="regervation_part text-center" style="background:none;">
                <button type="submit" class="btn regerv_btn_iner">Submit</button>
              </div>
            </form>
          </div>
        </div>
        <div class="col-lg-3 col-md-3">
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [
    `.ng-select.custom ::ng-deep .ng-select-container {
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
      transition: border-color .15s ease-in-out, box-
    }`,
    `.ng-select.custom ::ng-deep .ng-clear-wrapper {
      /* width: 0px; */
      display: none;
    }`,
    `.ng-select.ng-select-single.custom ::ng-deep .ng-value-container .ng-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: -10px;
    }`,
    `.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: -5px;
    }`,
    `.ng-select.custom ::ng-deep .ng-select-container .ng-value-container .ng-placeholder {
      color: #838586;
      margin-left: -11px;
    }`,
    `.ng-select.ng-select-single.custom ::ng-deep .ng-select-container .ng-value-container .ng-input {
      top: 6px;
      left: 0;
      padding-left: 11px;
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
export class JoinDocsComponent implements OnInit {
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
            enableHtml: true,
          });
          this.joinUs.reset();
          setTimeout(() => { this.getCurrentLocation(); }, 500);
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
