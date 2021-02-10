import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HomeService } from 'src/app/home.service';
import { UsersModalComponent } from 'src/app/users-modal/users-modal.component';

@Component({
  selector: 'app-header',
  template: `
  <header class="main_menu home_menu dashbord-headers">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-12">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" routerLinkActive="active" routerLink="/home">
            <img [defaultImage]="'assets/img/logo-white.png'" [lazyLoad]="'assets/img/logo-white.png'"
              [errorImage]="'assets/img/logo-white.png'" alt="logo" height="70"> </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span> </button>
          <div class="collapse navbar-collapse main-menu-item justify-content-end" id="navbarSupportedContent">
            <ul class="navbar-nav align-items-center">
              <li class="nav-item"><a class="nav-link" routerLinkActive="active" routerLink="/home">Home</a></li>
              <li class="nav-item" routerLinkActive="active" style="cursor: pointer;"><a class="nav-link"
                  routerLink="/benefits">Benefits</a></li>
              <li class="nav-item" routerLinkActive="active" style="cursor: pointer;"><a class="nav-link"
                  routerLink="/features">Features</a></li>
              <li class="d-none d-lg-block" *ngIf="!doctor && !facility"><a class="btn_1" (click)="openAsk()"
                  style="font-size: 16px; cursor: pointer;">Log in / Register</a></li>
                  <li class="d-none d-lg-block pl-0 list_practice" *ngIf="doctor"><a class="btn_1 ml-0 meetingbtn" style="cursor: pointer;" routerLink="/doctor/dashboard" [routerLinkActiveOptions]="{ exact: true }">
                    <i class="ti-back-left d-inline-block" style="-webkit-transform: scaleY(-1);transform: scaleY(-1);font-size:16px;vertical-align:middle;"></i> Dashboard</a></li>
                <li class="d-none d-lg-block pl-0 list_practice" *ngIf="facility"><a class="btn_1 ml-0 meetingbtn" style="cursor: pointer;" routerLink="/facility/facility-dashboard" [routerLinkActiveOptions]="{ exact: true }">
                    <i class="ti-back-left d-inline-block" style="-webkit-transform: scaleY(-1);transform: scaleY(-1);font-size:16px;vertical-align:middle;"></i> Dashboard</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </div>
</header>
<ngx-spinner [fullScreen]="true" color="#fff" type="" bdColor="rgba(0, 0, 0, 0.9)">
  <div class="loader">
    <img class="logo-icon" [defaultImage]="'assets/img/favicon.png'" [lazyLoad]="'assets/img/favicon.png'"
      [errorImage]="'assets/img/favicon.png'" alt="DocsTime"><span>Loading...</span>
  </div>
</ngx-spinner>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  bsModalRef: BsModalRef;
  doctor: any;
  facility: any;
  constructor(
    public service: HomeService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
  ) { }
  openAsk = () => {
    this.bsModalRef = this.modalService.show(UsersModalComponent, { id: 221 });
  }
  ngOnInit(): void {
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
}
