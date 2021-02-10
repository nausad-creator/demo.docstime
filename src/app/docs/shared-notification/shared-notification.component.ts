import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';
import { DocsService } from '../docs.service';

@Component({
  selector: 'app-shared-notification',
  templateUrl: './shared-notification.component.html',
  styleUrls: ['./shared-notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedNotificationComponent implements OnInit {
  @Input() notificationID: string;
  @Input() notificationMessageText: string;
  @Input() notificationReadStatus: string;
  @Input() notificationSendDate: string;
  @Input() notificationSendTime: string;
  @Input() notificationReferenceKey: string;
  @Input() notificationType: string;
  subStrType: string;
  @Input() wholeObj: any;
  date: Date;
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() navigate: EventEmitter<any> = new EventEmitter();
  constructor(
    private docService: DocsService,
    private toastr: ToastrService,
    private service: HomeService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.date = new Date(`${this.notificationSendDate} ${this.notificationSendTime}`);
    this.notificationSendTime = this.tConvert(this.notificationSendTime);
    this.subStrType = this.notificationMessageText.substring(0, 23);
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
  onClickDelete = (notificationID: string) => {
    this.spinner.show();
    const data = {
      loginuserID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID :
        this.service.getDocSession().doctorID, languageID: '1', notificationID
    };
    this.delete(JSON.stringify(data))
    .then(res => res[0].status === 'true' ? this.toastr.success('Deleted successfully') : this.toastr.error('Some error occured, please try again later'))
      .catch(() => this.toastr.error('Some error occured, please try again later'))
      .finally(() => { this.update.emit(); this.spinner.hide(); });
  }
  delete = (post: string) => {
    return new Promise((resolve, reject) => {
      this.docService.deleteNotification(post).subscribe((res) => resolve(res), error => reject(error));
    });
  }
  navigateToDetails = (notificationReferenceKey: string, notificationType: string) => {
    if (
      notificationType === 'refercase-created' ||
      this.notificationMessageText.substring(0, 23) === 'Thank you for accepting' ||
      this.notificationMessageText.substring(0, 23) === 'URGENT Thank you for ac'
      ) {
      this.navigate.emit(notificationReferenceKey);
    }
  }
}
