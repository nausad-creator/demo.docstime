import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FacilityLoginSignupComponent } from '../facility-login-signup/facility-login-signup.component';
import { LoginSignupModalComponent } from '../login-signup-modal/login-signup-modal.component';

@Component({
  selector: 'app-users-modal',
  template: `
  <div _ngcontent-jxn-c185="" class="modal-contents modal-login">
  <div _ngcontent-jxn-c185="" class="modal-body">
    <!-- error handler -->
    <div class="alert alert-primary" role="alert" *ngIf="message">
      <h5 class="alert-heading text-center">Info!</h5>
      <p class="mb-0 text-center">{{message}}</p>
    </div>
    <!-- end error handler -->
    <div _ngcontent-jxn-c185="" class="tab-content py-0">
      <div _ngcontent-jxn-c185="" id="navbarLogin-login" role="tabpanel" class="tab-pane fade active show">
        <form _ngcontent-jxn-c185="" novalidate="" class="text-center ng-untouched ng-pristine ng-valid">
          <div _ngcontent-jxn-c185="" class="pb-3">
            <div _ngcontent-jxn-c185="" class="wp-social-login-widget">
              <div _ngcontent-jxn-c185="" class="wp-social-login-connect-with">
                <h4 style="color: #039eff;">What are you?</h4>
              </div>
              <br>
              <div _ngcontent-jxn-c185="" class="wp-social-login-provider-list row justify-content-center">
                <a _ngcontent-jxn-c185="" (click)="openPatient()" class="cursr linkarrow col-3">
                  <div class="iconswi"><img [defaultImage]="'assets/img/patient-img.png'" [lazyLoad]="'assets/img/patient-img.png'" [errorImage]="'assets/img/patient-img.png'" alt="Patient"></div>
                  <div class="text-dark mt-2">Patient</div>
                </a>
                <a _ngcontent-jxn-c185="" (click)="openFacility()" class="cursr linkarrow col-3">
                  <div class="iconswi"><img [defaultImage]="'assets/img/facility-img.png'" [lazyLoad]="'assets/img/facility-img.png'" [errorImage]="'assets/img/facility-img.png'" alt="Facility"></div>
                  <div class="text-dark mt-2">Facility</div>
                </a>
                <a _ngcontent-jxn-c185="" (click)="openDoctor()" class="cursr linkarrow col-3">
                  <div class="iconswi"><img [defaultImage]="'assets/img/doctor-img.png'" [lazyLoad]="'assets/img/doctor-img.png'" [errorImage]="'assets/img/doctor-img.png'" alt="Doctor"></div>
                  <div class="text-dark mt-2">Doctor</div>
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [
    `.cursr{
      cursor: pointer;
    }`,
    `.fa-user:before {
    content: "\f007";
    padding-right: 2px;
  }`,
    `.modal-contents {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: .3rem;
  outline: 0;
}`
  ]
})
export class UsersModalComponent implements OnInit {
  bModalRef: BsModalRef;
  message: string;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }
  onCloseAsk = () => {
    this.bsModalRef.hide();
  }
  openFacility = () => {
    this.onCloseAsk();
    this.bsModalRef = this.modalService.show(FacilityLoginSignupComponent, { id: 99 });
    this.bsModalRef.content.event.subscribe((res: { data: string; }) => {
      if (res.data === 'Confirmed') {
        setTimeout(() => {
          this.router.navigate(['/facility/facility-dashboard']);
        }, 100);
      } else {
        console.error(res.data);
      }
    });
  }
  openDoctor = () => {
    this.onCloseAsk();
    this.bsModalRef = this.modalService.show(LoginSignupModalComponent, { id: 223 });
    this.bsModalRef.content.event.subscribe((res: { data: string; }) => {
      if (res.data === 'Confirmed') {
        setTimeout(() => {
          this.router.navigate(['/doctor/dashboard']);
        }, 100);
      } else {
        console.error(res.data);
      }
    });
  }
  openPatient = () => {
    this.message = 'Patient implementation is in-process...';
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
