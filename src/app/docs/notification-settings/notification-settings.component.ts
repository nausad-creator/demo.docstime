import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';
import { DocsService } from '../docs.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationSettingsComponent implements OnInit {
  docData: any;
  constructor(
    private docService: DocsService,
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.docData = this.service.getDocLocal() ? this.service.getDocLocal() : this.service.getDocSession();
    this.cd.markForCheck();
  }

  onChangeAppointmentPush = (value: string) => {
    value === 'Yes'
      ? this.doctorAppointmentPush('No').then((fulfilled: Array<any>) => {
        this.service.getDocLocal() ?
          this.service.setDocLocal(JSON.stringify(fulfilled[0])) :
          this.service.setDocSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      })
      : this.doctorAppointmentPush('Yes').then((fulfilled: Array<any>) => {
        this.service.getDocLocal() ?
          this.service.setDocLocal(JSON.stringify(fulfilled[0])) :
          this.service.setDocSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      });
  }
  onChangeRatingPush = (value: string) => {
    value === 'Yes'
      ? this.doctorRatingPush('No').then((fulfilled: Array<any>) => {
        this.service.getDocLocal() ?
          this.service.setDocLocal(JSON.stringify(fulfilled[0])) :
          this.service.setDocSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      })
      : this.doctorRatingPush('Yes').then((fulfilled: Array<any>) => {
        this.service.getDocLocal() ?
          this.service.setDocLocal(JSON.stringify(fulfilled[0])) :
          this.service.setDocSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      });
  }
  onChangeAdminPush = (value: string) => {
    value === 'Yes'
      ? this.doctorAdminPush('No').then((fulfilled: Array<any>) => {
        this.service.getDocLocal() ?
          this.service.setDocLocal(JSON.stringify(fulfilled[0])) :
          this.service.setDocSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      })
      : this.doctorAdminPush('Yes').then((fulfilled: Array<any>) => {
        this.service.getDocLocal() ?
          this.service.setDocLocal(JSON.stringify(fulfilled[0])) :
          this.service.setDocSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      });
  }
  onChangeRefferedCasePush = (value: string) => {
    value === 'Yes'
      ? this.doctorReferredCasePush('No').then((fulfilled: Array<any>) => {
        this.service.getDocLocal() ?
          this.service.setDocLocal(JSON.stringify(fulfilled[0])) :
          this.service.setDocSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      })
      : this.doctorReferredCasePush('Yes').then((fulfilled: Array<any>) => {
        this.service.getDocLocal() ?
          this.service.setDocLocal(JSON.stringify(fulfilled[0])) :
          this.service.setDocSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      });
  }

  doctorRatingPush = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        logindoctorID: this.docData.doctorID,
        doctorAppointmentPush: this.docData.doctorAppointmentPush,
        doctorAdminPush: this.docData.doctorAdminPush,
        doctorRatingPush: value,
        doctorReferredCasePush: this.docData.doctorReferredCasePush,
      };
      this.spinner.show();
      this.docService.updateNotifications(JSON.stringify(data)).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response[0].message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  doctorAdminPush = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        logindoctorID: this.docData.doctorID,
        doctorAppointmentPush: this.docData.doctorAppointmentPush,
        doctorAdminPush: value,
        doctorRatingPush: this.docData.doctorRatingPush,
        doctorReferredCasePush: this.docData.doctorReferredCasePush,
      };
      this.spinner.show();
      this.docService.updateNotifications(JSON.stringify(data)).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response[0].message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  doctorReferredCasePush = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        logindoctorID: this.docData.doctorID,
        doctorAppointmentPush: this.docData.doctorAppointmentPush,
        doctorAdminPush: this.docData.doctorAdminPush,
        doctorRatingPush: this.docData.doctorRatingPush,
        doctorReferredCasePush: value,
      };
      this.spinner.show();
      this.docService.updateNotifications(JSON.stringify(data)).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response[0].message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  doctorAppointmentPush = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        logindoctorID: this.docData.doctorID,
        doctorAppointmentPush: value,
        doctorAdminPush: this.docData.doctorAdminPush,
        doctorRatingPush: this.docData.doctorRatingPush,
        doctorReferredCasePush: this.docData.doctorReferredCasePush,
      };
      this.spinner.show();
      this.docService.updateNotifications(JSON.stringify(data)).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response[0].message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
