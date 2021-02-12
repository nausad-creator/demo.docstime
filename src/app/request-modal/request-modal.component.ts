import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../home.service';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-request-modal',
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestModalComponent implements OnInit {
  requestForm: FormGroup;
  minTime: Date;
  min: Date;
  startAt: Date;
  options = {
    types: [],
    componentRestrictions: { country: 'USA' }
  };
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('dateInput', { static: true }) dateTyped: ElementRef;
  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private locService: LocationService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private service: HomeService,
    private spinner: NgxSpinnerService
  ) {
    this.requestForm = this.fb.group({
      meetingName: [null, Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern('^[a-zA-Z \-\']+')])],
      meetingEmail: [null, Validators.compose([Validators.required, Validators.
        pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      meetingMobile: [null, Validators.compose([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')])],
      meetingFax: [null, Validators.compose([Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')])],
      meetingDate: [''],
      meetingTime: [''],
      meetingAddress: ['', Validators.compose([Validators.required])],
      meetingZip: [null, Validators.compose([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{5}$')])],
      meetingCity: ['', Validators.compose([Validators.required])],
      meetingState: ['', Validators.compose([Validators.required])],
    });
    // for disabling previous dates from current date
    let month: any;
    let day: any;
    const dtToday = new Date();
    const year = dtToday.getFullYear();
    let hour = dtToday.getHours();
    const minutes = dtToday.getMinutes();
    const seconds = dtToday.getSeconds();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    if (minutes >= 45) {
      hour++;
    }
    this.min = new Date(year, month - 1, day);
    this.startAt = new Date
      (
        year, month - 1, day, hour,
        minutes >= 0 && minutes < 15 ? 15 :
          minutes >= 15 && minutes < 30 ? 30 :
            minutes >= 30 && minutes < 45 ? 45 :
              minutes >= 45 ? 0 : 15, seconds
      );
  }
  ngOnInit(): void {
    this.locService.get().subscribe(
      (add: string) => {
        if (add !== 'Not found' && add !== null && add !== undefined && add !== '') {
          const formatted = add.split(', ');
          const zipState = formatted[formatted.length - 2].toString();
          const zipAndState = zipState ? zipState.split(' ') : '';
          this.requestForm.get('meetingAddress').patchValue(`${formatted.length > 0 ? formatted[0] : ''}, ${formatted.length >= 1 ? formatted[1] : ''}`);
          this.requestForm.get('meetingZip').patchValue(`${zipState ? zipAndState[1] : ''}`);
          this.requestForm.get('meetingCity').patchValue(`${formatted[formatted.length - 3] ? formatted[formatted.length - 3] : ''}`);
          this.requestForm.get('meetingState').patchValue(`${zipState ? zipAndState[0] : ''}`);
          this.cd.markForCheck();
        }
      }, err => console.error(err));
    this.requestForm.get('meetingTime').valueChanges.pipe().subscribe(() => { this.check(); });
    this.requestForm.get('meetingDate').valueChanges.pipe().subscribe(() => { this.timeAndDate(); });
  }
  check = () => {
    if (this.requestForm.get('meetingDate').value === '') {
      this.requestForm.get('meetingTime').patchValue('', { emitEvent: false });
      this.requestForm.get('meetingTime').setErrors({ emptyDate: true });
      this.cd.markForCheck();
    } else {
      this.requestForm.get('meetingTime').setErrors(null);
      this.requestForm.get('meetingTime').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
  timeAndDate = () => {
    const date1 = new Date();
    let month: any;
    let day: any;
    const dtToday = new Date();
    const year = dtToday.getFullYear();
    let hour = dtToday.getHours();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    const minutes = dtToday.getMinutes();
    const seconds = dtToday.getSeconds();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    if (minutes >= 45) {
      hour++;
    }
    const date2 = new Date(this.requestForm.get('meetingDate').value);
    date2.setHours(hour, minutes, 0, 0);
    date1.setHours(hour, minutes, 0, 0);
    if (date1.getTime() === date2.getTime()) {
      this.minTime = new Date();
      this.cd.markForCheck();
    } else {
      this.minTime = null;
      this.cd.markForCheck();
    }
    this.startAt = new Date
      (
        year, month - 1, day, hour,
        minutes >= 0 && minutes < 15 ? 15 :
          minutes >= 15 && minutes < 30 ? 30 :
            minutes >= 30 && minutes < 45 ? 45 :
              minutes >= 45 ? 0 : 15, seconds
      );
    this.requestForm.get('meetingTime').patchValue('', { emitEvent: false });
    this.requestForm.get('meetingTime').updateValueAndValidity({ emitEvent: false });
    this.cd.markForCheck();
  }

  onSubmit = (post: any) => {
    this.markFormTouched(this.requestForm);
    if (!post.meetingDate && !post.meetingTime) {
      this.requestForm.get('meetingDate').setErrors({ emptyDate: true });
      this.requestForm.get('meetingTime').patchValue('', { emitEvent: false });
      this.requestForm.get('meetingTime').updateValueAndValidity({ emitEvent: false });
      this.requestForm.get('meetingTime').setErrors({ emptyTime: true });
    } else if (post.meetingDate && !post.meetingTime) {
      this.requestForm.get('meetingTime').patchValue('', { emitEvent: false });
      this.requestForm.get('meetingTime').updateValueAndValidity({ emitEvent: false });
      this.requestForm.get('meetingTime').setErrors({ emptyTime: true });
    } else if (!post.meetingDate && post.meetingTime) {
      this.requestForm.get('meetingDate').setErrors({ emptyDate: true });
    } else {
      if (this.requestForm.valid && this.findInvalidControls().length === 0) {
        const data = {
          meetingName: post.meetingName ? post.meetingName.trim() : '',
          meetingEmail: post.meetingEmail ? post.meetingEmail.trim() : '',
          meetingMobile: post.meetingMobile ? post.meetingMobile.trim() : '',
          meetingFax: post.meetingFax ? post.meetingFax.trim() : '',
          meetingDate: post.meetingDate && post.meetingTime ?
            `${moment(post.meetingDate).format('YYYY-MM-DD')} ${moment(post.meetingTime, 'h:mm:ss A').format('HH:mm:ss')}` : '',
          meetingLocation: post.meetingAddress && post.meetingZip && post.meetingCity && post.meetingState ?
            `${post.meetingAddress.trim()}, ${post.meetingZip.trim()}, ${post.meetingCity.trim()}, ${post.meetingState.trim()}` : '',
        };
        this.request(JSON.stringify(data)).then(() => {
          setTimeout(() => {
            this.openToastr(post.meetingDate, post.meetingTime);
            setTimeout(() => {
              this.requestForm.reset();
              this.bsModalRef.hide();
            }, 500);
          }, 1000);
        }).catch(() => this.toastr.error('Error', 'Some error occured, please try again later.'))
          .finally(() => this.spinner.hide());
      }
    }
  }
  request = (post: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.service.requestMeeting(post).subscribe(
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
    const controls = this.requestForm.controls;
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
  openToastr = (date: string, time: string) => {
    this.toastr.success(`<h5>Your Appointment is confirmed on ${moment(date).format('dddd, MMMM Do YYYY')} at ${moment(time, 'h:mm:ss A').format('hh:mm a')}.</h5>You will get notifications with details.`
      , '', {
      positionClass: 'toast-center-center-request',
      closeButton: true,
      timeOut: 9000,
      enableHtml: true,
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
          this.requestForm.get('meetingAddress').patchValue(`${address.name ? `${address.name}, ${selected.length > 0 ? selected[0] : ''}` : address.formatted_address}`);
          this.requestForm.get('meetingZip').patchValue(`${zipState ? zipAndState[1] : ''}`);
          this.requestForm.get('meetingCity').patchValue(`${formatted[formatted.length - 3] ? formatted[formatted.length - 3] : ''}`);
          this.requestForm.get('meetingState').patchValue(`${zipState ? zipAndState[0] : ''}`);
          this.cd.markForCheck();
        }
      }, err => console.error(err));
  }
  onKeyDate = (value: string) => {
    let input = value;
    if (/\D\/$/.test(input)) { input = input.substr(0, input.length - 3); }
    const values = input.split('/').map((v) => v.replace(/\D/g, ''));
    if (values[0]) { values[0] = this.checkValue(values[0], 12); }
    if (values[1]) { values[1] = this.checkValue(values[1], 31); }
    const output = values.map((v, i) => v.length === 2 && i < 2 ? v + ' / ' : v);
    this.dateTyped.nativeElement.value = output.join('').substr(0, 14);
  }
  checkValue = (str: string, max: number) => {
    if (str.charAt(0) !== '0' || str === '00') {
      let num = +str;
      if (isNaN(num) || num <= 0 || num > max) { num = 1; }
      str = num > +(max.toString().charAt(0)) && num.toString().length === 1 ? '0' + num : num.toString();
    }
    return str;
  }
  onBlur = (value: string) => {
    const input = value;
    const values = input.split('/').map((v) => v.replace(/\D/g, ''));
    let output = '';
    if (values.length === 3) {
      const year = values[2].length !== 4 ? +(values[2]) + 2000 : +(values[2]);
      const month = +(values[0]) - 1;
      const day = +(values[1]);
      const d = new Date(year, month, day);
      if (!isNaN(+d)) {
        document.getElementById('date').innerText = d.toString();
        const dates = [d.getMonth() + 1, d.getDate(), d.getFullYear()];
        output = dates.map((v) => {
          v = v;
          return v.toString().length === 1 ? '0' + v : v;
        }).join(' / ');
      }
    }
    if (output) {
      this.dateTyped.nativeElement.value = output.replace(/\s/g, '');
      this.cd.markForCheck();
    }
    if (!output) {
      this.dateTyped.nativeElement.value = '';
      this.requestForm.get('meetingDate').patchValue('', { emitEvent: false });
      this.requestForm.get('meetingDate').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
  }
}
