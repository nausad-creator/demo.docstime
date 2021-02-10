import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HomeService } from '../home.service';
import { LocationService } from '../location.service';
import { RequestModalComponent } from '../request-modal/request-modal.component';
import { UsersModalComponent } from '../users-modal/users-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  bsModalRef: BsModalRef;
  doctor: any;
  facility: any;
  joinUs: FormGroup;
  specialityList$: Observable<Array<any>>;
  options = {
    types: [],
    componentRestrictions: { country: 'USA' }
  };
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  constructor(
    private modalService: BsModalService,
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
      joinMessage: ['Message'],
      joinType: ['General'],
      joinSpeciality: [null, Validators.compose([Validators.required])],
    });
  }
  openAsk = () => {
    this.bsModalRef = this.modalService.show(UsersModalComponent, { id: 221 });
  }
  openRequest = () => {
    this.bsModalRef = this.modalService.show(RequestModalComponent, { id: 227 });
  }
  ngOnInit(): void {
    this.jquery();
    this.getCurrentLocation();
    this.specialityList$ = this.service.getSpecility;
    this.chechUser();
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
  chechUser = () => {
    this.doctor = this.service.getDocLocal() ?
      this.service.getDocLocal() :
      this.service.getDocSession() ?
        this.service.getDocSession() : '';
    this.cd.markForCheck();
    this.facility = this.service.getFaLocal() ?
      this.service.getFaLocal() :
      this.service.getFaSession() ?
        this.service.getFaSession() : '';
    this.cd.markForCheck();
  }
  jquery = () => {
    jQuery(() => {
      ($('.client_review_part') as any).owlCarousel({
        items: 1,
        loop: true,
        dots: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 15000,
        nav: false,
        navText: ['<i class=\'ti-angle-left\'></i>', '<i class=\'ti-angle-right\'></i>'],
        smartSpeed: 2000,
        responsive: {
          0: {
            nav: true,
            mouseDrag: false
          },
          600: {
            nav: true,
            mouseDrag: false
          },
          1000: {

          }
        }
      });
      ($('.testimonials-carousel') as any).owlCarousel({
        loop: true,
        nav: true,
        margin: 10,
        items: 2,
        responsiveClass: true,
        navText: ['<i class=\'ti-angle-left\'></i>', '<i class=\'ti-angle-right\'></i>'],
        responsive: {
          0: {
            items: 1,
            nav: true
          },
          600: {
            items: 1,
            nav: false
          },
          1000: {
            items: 2,
            nav: true,
            loop: false
          }
        }
      });
    });
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
