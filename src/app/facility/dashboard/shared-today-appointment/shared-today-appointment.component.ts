import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Refer } from '../../docs.interface';

@Component({
  selector: 'app-shared-today-appointment',
  template: `<div class="item">
  <a style="cursor: pointer;" (click)="onClickView(wholeOBject)" class="usersdeta-items d-flex">
    <div class="lefttext">
      <h4 class="mb-0">{{(fullName | titlecase) + ' ' + genderAtZero + '/' + age + ' ' + 'yrs' + '' + (refSpecialityName | titlecase)}}</h4>
      <p class="mb-0">{{reasonName | titlecase}}</p>
    </div>
    <div class="rightttie ml-auto">
      <div class="circle" *ngIf="refercaseVisitTime"><span style="margin: 2px;">{{convertedTime}}</span></div>
    </div>
  </a>
</div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTodayAppointmentComponent implements OnInit {
  @Input() patientFirstName: string;
  @Input() patientLastName: string;
  @Input() reasonName: string;
  @Input() patientGender: string;
  @Input() age: string;
  @Input() refSpecialityName: string;
  @Input() refercaseVisitDate: string;
  @Input() refercaseVisitTime: string;
  @Input() refercaseStatus: string;
  @Input() wholeOBject: any;
  @Output() view: EventEmitter<any> = new EventEmitter();
  genderAtZero: string;
  fullName: string;
  convertedTime: string;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.refSpecialityName = this.refSpecialityName ? `/${this.refSpecialityName}` : '';
    this.genderAtZero = this.patientGender ? this.patientGender.charAt(0) : '';
    this.fullName = this.patientFirstName && this.patientLastName ?
      `${this.patientFirstName} ${this.patientLastName}`
      : this.patientFirstName && !this.patientLastName ?
        this.patientFirstName : !this.patientFirstName && this.patientLastName ? this.patientLastName : '';
    this.convertedTime = this.refercaseVisitTime !== null && this.refercaseVisitTime !== undefined && this.refercaseVisitTime ?
      this.tConvert(this.refercaseVisitTime) : '';
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
    return `${time[0]}${time[1]}${time[2]} ${time[5]}`; // return adjusted time or original string
  }

  onClickView = (referral: Refer) => {
    this.view.emit(JSON.stringify(referral));
  }

}
