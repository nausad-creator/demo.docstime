import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DocStore } from '../doc-store.service';
import { ReferCase } from '../docs.interface';

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
  constructor(private router: Router, private cd: ChangeDetectorRef, private store: DocStore) { }

  ngOnInit(): void {
    this.fullName = this.patientFirstName && this.patientLastName ? `${this.patientFirstName} ${this.patientLastName}` : this.patientFirstName && !this.patientLastName ? this.patientFirstName : !this.patientFirstName && this.patientLastName ? this.patientLastName : '';
    this.convertedTime = this.refercaseVisitTime !== null && this.refercaseVisitTime !== undefined && this.refercaseVisitTime ? this.tConvert(this.refercaseVisitTime) : '';
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
  onNavigateViewDasboard = ($event: ReferCase) => {
    const data = { data: $event, from: 'dashboard' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`/doctor/dashboard/view-refer`]);
  }
  onNavigateViewMySchedule = ($event: ReferCase) => {
    const data = { data: $event, url: this.router.url };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/doctor/doc-my-schedule-view-refer']);
  }
  onNavigateViewSent = ($event: ReferCase) => {
    const data = { data: $event, from: 'insideSent' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`/doctor/referrals-sent/view-refer`]);
  }
  onNavigateViewReceived = ($event: ReferCase) => {
    const data = { data: $event, from: 'received' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`/doctor/referrals-received/view-refer`]);
  }
  onClickInsideView = ($event: ReferCase) => {
    const url = this.router.url.split('/');
    switch (url[2]) {
      case 'dashboard': {
        const data = { data: $event, from: 'dashboard' };
        this.store.setReferView(JSON.stringify(data));
        this.updateView.emit();
        break;
      }
      case 'referrals-sent': {
        const data = { data: $event, from: 'insideSent' };
        this.store.setReferView(JSON.stringify(data));
        this.updateView.emit();
        break;
      }
      case 'notifications': {
        const data = { data: $event, from: 'notifications' };
        this.store.setReferView(JSON.stringify(data));
        this.updateView.emit();
        break;
      }
      case 'add-refer-case': {
        const data = { data: $event, from: 'add-case' };
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
  onClickInsideAddCace = ($event: ReferCase) => {
    const url = this.router.url.split('/');
    const data = { data: $event, from: 'add-case' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate([`/${url[1]}/${url[2]}/view-refer`]);
  }
  onClickInsidereReferCace = ($event: ReferCase) => {
    const url = this.router.url.split('/');
    switch (url[2]) {
      case 'dashboard': {
        const data = { data: $event, from: 'dashboard' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`]);
        break;
      }
      case 'referrals-sent': {
        const data = { data: $event, from: 'insideSent' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`]);
        break;
      }
      case 'notifications': {
        const data = { data: $event, from: 'notifications' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`]);
        break;
      }
      case 'add-refer-case': {
        const data = { data: $event, from: 'add-case' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`]);
        break;
      }
      default: {
        const data = { data: $event, from: 'received' };
        this.store.setReferView(JSON.stringify(data));
        this.router.navigate([`/${url[1]}/${url[2]}/view-refer`]);
        break;
      }
    }
  }
  onClickInsideSchedulReferCace = ($event: ReferCase) => {
    const data = { data: $event, url: '' };
    this.store.setReferView(JSON.stringify(data));
    this.router.navigate(['/doctor/doc-my-schedule-view-refer']);
  }
}
