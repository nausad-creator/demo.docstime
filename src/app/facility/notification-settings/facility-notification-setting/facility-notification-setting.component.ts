import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../../facility.service';

@Component({
  selector: 'app-facility-notification-setting',
  template: `<body class="dashbord-section">
  <div class="spacetop"></div>
  <section class="section-dashbord">
        <div class="container">
            <div class="">
        <div class="title-dashbord d-flex pt-3">
          <h4 class="text-dark mb-0">Notification Settings</h4>
        </div>

        <div class="appointment-conten pt-3">
          <div class="">
            <form class="text-left profile-form">
              <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12 mb-2">
                  <div class="card">
                    <div class="card-header"><h5 class="mb-0">App Notifications</h5></div>
                    <div class="switchgroup card-body">
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc1" class="mb-0">Appointments </label>
                        <label class="switch ml-auto">
                          <input id="swc1" type="checkbox" (change)="onChangeAppointmentPush($event.target.value)"
                          [checked]="facData.facilityuserAppointmentPush === 'Yes'" [value]="facData.facilityuserAppointmentPush" >
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc2" class="mb-0">Referred Cases</label>
                        <label class="switch ml-auto">
                          <input id="swc2" (change)="onChangeRefferedCasePush($event.target.value)"
                          [checked]="facData.facilityuserReferredCasePush === 'Yes'" [value]="facData.facilityuserReferredCasePush" type="checkbox">
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc3" class="mb-0">Appointment Rating</label>
                        <label class="switch ml-auto">
                          <input id="swc3" (change)="onChangeRatingPush($event.target.value)"
                          [checked]="facData.facilityuserRatingPush === 'Yes'" [value]="facData.facilityuserRatingPush" type="checkbox">
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc4" class="mb-0">Admin Announcement</label>
                        <label class="switch ml-auto">
                          <input id="swc4" (change)="onChangeAdminPush($event.target.value)"
                          [checked]="facData.facilityuserAdminPush === 'Yes'" [value]="facData.facilityuserAdminPush" type="checkbox" >
                          <span class="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 mb-2">
                  <div class="card">
                    <div class="card-header"><h5 class="mb-0">Email Notifications</h5></div>
                    <div class="switchgroup card-body">
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc1" class="mb-0">Appointments </label>
                        <label class="switch ml-auto">
                          <input id="swc1" type="checkbox" checked="checked">
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc2" class="mb-0">Referred Cases</label>
                        <label class="switch ml-auto">
                          <input id="swc2" type="checkbox">
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc3" class="mb-0">Appointment Rating</label>
                        <label class="switch ml-auto">
                          <input id="swc3" type="checkbox">
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc4" class="mb-0">Admin Announcement</label>
                        <label class="switch ml-auto">
                          <input id="swc4" type="checkbox" checked="checked">
                          <span class="slider"></span>
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 mb-2">
                  <div class="card">
                    <div class="card-header"><h5 class="mb-0">SMS Notifications</h5></div>
                    <div class="switchgroup card-body">
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc1" class="mb-0">Appointments </label>
                        <label class="switch ml-auto">
                          <input id="swc1" type="checkbox" checked="checked">
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc2" class="mb-0">Referred Cases</label>
                        <label class="switch ml-auto">
                          <input id="swc2" type="checkbox">
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc3" class="mb-0">Appointment Rating</label>
                        <label class="switch ml-auto">
                          <input id="swc3" type="checkbox">
                          <span class="slider"></span>
                        </label>
                      </div>
                      <div class="swtitem d-flex align-items-center">
                        <label for="swc4" class="mb-0">Admin Announcement</label>
                        <label class="switch ml-auto">
                          <input id="swc4" type="checkbox" checked="checked">
                          <span class="slider"></span>
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  <br>
  </body>
  `,
  styles: [``]
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
