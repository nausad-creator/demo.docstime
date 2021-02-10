import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';

@Component({
  selector: 'app-facility-notification-setting',
  templateUrl: './facility-notification-setting.component.html',
  styleUrls: ['./facility-notification-setting.component.css']
})
export class FacilityNotificationSettingComponent implements OnInit {
  facData: any;
  constructor(
    private facilitiService: FacilityService,
    private spinner: NgxSpinnerService,
    private service: HomeService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.facData = this.service.getFaLocal() ? this.service.getFaLocal() : this.service.getFaSession();
  }

  onChangeAppointmentPush = (value: string) => {
    value === 'Yes'
      ? this.facilityAppointmentPush('No').then((fulfilled: Array<any>) => {
        this.service.getFaLocal() ?
          this.service.setFaLocal(JSON.stringify(fulfilled[0])) :
          this.service.setFaSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      })
      : this.facilityAppointmentPush('Yes').then((fulfilled: Array<any>) => {
        this.service.getFaLocal() ?
          this.service.setFaLocal(JSON.stringify(fulfilled[0])) :
          this.service.setFaSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      });
  }
  onChangeRatingPush = (value: string) => {
    value === 'Yes'
      ? this.facilityRatingPush('No').then((fulfilled: Array<any>) => {
        this.service.getFaLocal() ?
          this.service.setFaLocal(JSON.stringify(fulfilled[0])) :
          this.service.setFaSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      })
      : this.facilityRatingPush('Yes').then((fulfilled: Array<any>) => {
        this.service.getFaLocal() ?
          this.service.setFaLocal(JSON.stringify(fulfilled[0])) :
          this.service.setFaSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      });
  }
  onChangeAdminPush = (value: string) => {
    value === 'Yes'
      ? this.facilityAdminPush('No').then((fulfilled: Array<any>) => {
        this.service.getFaLocal() ?
          this.service.setFaLocal(JSON.stringify(fulfilled[0])) :
          this.service.setFaSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      })
      : this.facilityAdminPush('Yes').then((fulfilled: Array<any>) => {
        this.service.getFaLocal() ?
          this.service.setFaLocal(JSON.stringify(fulfilled[0])) :
          this.service.setFaSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      });
  }
  onChangeRefferedCasePush = (value: string) => {
    value === 'Yes'
      ? this.facilityReferredCasePush('No').then((fulfilled: Array<any>) => {
        this.service.getFaLocal() ?
          this.service.setFaLocal(JSON.stringify(fulfilled[0])) :
          this.service.setFaSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      })
      : this.facilityReferredCasePush('Yes').then((fulfilled: Array<any>) => {
        this.service.getFaLocal() ?
          this.service.setFaLocal(JSON.stringify(fulfilled[0])) :
          this.service.setFaSession(JSON.stringify(fulfilled[0]));
        setTimeout(() => { this.ngOnInit(); this.spinner.hide(); }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.toastr.error('some error occured', 'error');
      });
  }

  facilityRatingPush = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        facilityuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID : this.service.getFaSession().facilityuserID,
        facilityuserAppointmentPush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserAppointmentPush : this.service.getFaSession().facilityuserAppointmentPush,
        facilityuserAdminPush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserAdminPush : this.service.getFaSession().facilityuserAdminPush,
        facilityuserRatingPush: value,
        facilityuserReferredCasePush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserReferredCasePush : this.service.getFaSession().facilityuserReferredCasePush,
      };
      this.spinner.show();
      this.facilitiService.updateNotifications(JSON.stringify(data)).subscribe(
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

  facilityAdminPush = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        facilityuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID : this.service.getFaSession().facilityuserID,
        facilityuserAppointmentPush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserAppointmentPush : this.service.getFaSession().facilityuserAppointmentPush,
        facilityuserAdminPush: value,
        facilityuserRatingPush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserRatingPush : this.service.getFaSession().facilityuserRatingPush,
        facilityuserReferredCasePush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserReferredCasePush : this.service.getFaSession().facilityuserReferredCasePush,
      };
      this.spinner.show();
      this.facilitiService.updateNotifications(JSON.stringify(data)).subscribe(
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

  facilityReferredCasePush = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        facilityuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID : this.service.getFaSession().facilityuserID,
        facilityuserAppointmentPush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserAppointmentPush : this.service.getFaSession().facilityuserAppointmentPush,
        facilityuserAdminPush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserAdminPush : this.service.getFaSession().facilityuserAdminPush,
        facilityuserRatingPush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserRatingPush : this.service.getFaSession().facilityuserRatingPush,
        facilityuserReferredCasePush: value,
      };
      this.spinner.show();
      this.facilitiService.updateNotifications(JSON.stringify(data)).subscribe(
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

  facilityAppointmentPush = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        facilityuserID: this.service.getFaLocal() ? this.service.getFaLocal().facilityuserID : this.service.getFaSession().facilityuserID,
        facilityuserAppointmentPush: value,
        facilityuserAdminPush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserAdminPush : this.service.getFaSession().facilityuserAdminPush,
        facilityuserRatingPush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserRatingPush : this.service.getFaSession().facilityuserRatingPush,
        facilityuserReferredCasePush: this.service.getFaLocal() ?
          this.service.getFaLocal().facilityuserReferredCasePush : this.service.getFaSession().facilityuserReferredCasePush,
      };
      this.spinner.show();
      this.facilitiService.updateNotifications(JSON.stringify(data)).subscribe(
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
