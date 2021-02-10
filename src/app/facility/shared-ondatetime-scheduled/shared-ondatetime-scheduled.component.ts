import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../store.service';

@Component({
  selector: 'app-shared-ondatetime-scheduled',
  templateUrl: './shared-ondatetime-scheduled.component.html',
  styleUrls: ['./shared-ondatetime-scheduled.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedOndatetimeScheduledComponent implements OnInit {
  @Input() patientFirstName: string;
  @Input() patientLastName: string;
  @Input() reasonName: string;
  @Input() refercaseVisitTime: string;
  @Input() refercaseStatus: string;
  @Input() from: string;
  @Input() wholeObj: any;
  fullName: string;
  convertedTime: string;
  @Output() updateView: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router, private cd: ChangeDetectorRef, private store: Store) { }

  ngOnInit(): void {
    this.fullName = this.patientFirstName && this.patientLastName ?
      `${this.patientFirstName} ${this.patientLastName}`
      : this.patientFirstName && !this.patientLastName ?
        this.patientFirstName : !this.patientFirstName && this.patientLastName ? this.patientLastName : '';
    this.convertedTime = this.refercaseVisitTime !== null && this.refercaseVisitTime !== undefined ?
      this.tConvert(this.refercaseVisitTime) :
      this.convertedTime = '';
    this.cd.markForCheck();
  }
  tConvert = (time: any) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    time[0] < 10 ? (time[0] = '0' + time[0]) : (time[0] = time[0]);
    return time[0] + '' + time[1] + '' + time[2] + ' ' + time[5]; // return adjusted time or original string
  }
  onNavigateViewDasboard = ($event: any) => {
    const data = { data: $event, from: 'dashboard' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`${this.router.url}/view-refer`], { state: { data } });
  }
  onNavigateViewMySchedule = ($event: any) => {
    const data = { data: $event, url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/my-schedule-view-refer'], { state: { data } });
  }
  onNavigateViewSent = ($event: any) => {
    const data = { data: $event, from: 'insideSent' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`${this.router.url}/view-refer`], { state: { data } });
  }
  onNavigateViewReceived = ($event: any) => {
    const data = { data: $event, from: 'received' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`${this.router.url}/view-refer`], { state: { data } });
  }
  onClickInsideView = ($event: any) => {
    const url = this.router.url.split('/');
    switch (url[2]) {
      case 'facility-dashboard': {
        const data = { data: $event, from: 'dashboard' };
        this.store.setReferView(JSON.stringify(data));
        this.updateView.emit();
        break;
      }
      case 'facility-referral-sent': {
        const data = { data: $event, from: 'insideSent' };
        this.store.setReferView(JSON.stringify(data));
        this.updateView.emit();
        break;
      }
      case 'facility-doctors-list': {
        const data = { data: $event, from: 'doctorsList' };
        this.store.setReferView(JSON.stringify(data));
        this.updateView.emit();
        break;
      }
      case 'facility-add-refer-case': {
        const data = { data: $event, from: 'add-case' };
        this.store.setReferView(JSON.stringify(data));
        this.updateView.emit();
        break;
      }
      case 'facility-notifications': {
        const data = { data: $event, from: 'notifications' };
        this.store.setReferView(JSON.stringify(data));
        this.updateView.emit();
        break;
      }
      default: {
        const data = { data: $event, from: 'received' };
        this.store.setReferView(JSON.stringify(data));
        this.updateView.emit();
        break;
      }
    }
  }
  onClickInsideAddCace = ($event: any) => {
    const url = this.router.url.split('/');
    const data = { data: $event, from: 'add-case' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`/${url[1]}/${url[2]}/view-refer`]);
  }
  onClickInsidereReferCace = ($event: any) => {
    const url = this.router.url.split('/');
    switch (url[2]) {
      case 'facility-dashboard': {
        const data = { data: $event, from: 'dashboard' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`], { state: { data } });
        break;
      }
      case 'facility-referral-sent': {
        const data = { data: $event, from: 'insideSent' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`], { state: { data } });
        break;
      }
      case 'facility-doctors-list': {
        const data = { data: $event, from: 'doctorsList' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`], { state: { data } });
        break;
      }
      case 'facility-add-refer-case': {
        const data = { data: $event, from: 'add-case' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`], { state: { data } });
        break;
      }
      case 'facility-notifications': {
        const data = { data: $event, from: 'notifications' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`], { state: { data } });
        break;
      }
      default: {
        const data = { data: $event, from: 'received' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`], { state: { data } });
        break;
      }
    }
  }
  onClickInsideSchedulReferCace = ($event: any) => {
    const data = { data: $event, url: '' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/facility/my-schedule-view-refer'], { state: { data } });
  }
  onClickInsideDoctorsViewCace = ($event: any) => {
    const data = { data: $event, from: 'doctorsList' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`${this.router.url}/view-refer`], { state: { data } });
  }
}
