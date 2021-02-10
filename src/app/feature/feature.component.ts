import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HomeService } from '../home.service';
import { UsersModalComponent } from '../users-modal/users-modal.component';

@Component({
  selector: 'app-feature',
  template: `
  <header class="main_menu home_menu">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-12">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" routerLinkActive="active" routerLink="/home">
            <img [defaultImage]="'assets/img/logo.png'" [lazyLoad]="'assets/img/logo.png'"
              [errorImage]="'assets/img/logo.png'" class="logo-white" alt="logo" height="70">
              <img [defaultImage]="'assets/img/logo-white.png'" [lazyLoad]="'assets/img/logo-white.png'"
              [errorImage]="'assets/img/logo-white.png'" class="logo-blue" alt="logo">
             </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span> </button>
          <div class="collapse navbar-collapse main-menu-item justify-content-end" id="navbarSupportedContent">
            <ul class="navbar-nav align-items-center">
              <li class="nav-item"><a class="nav-link nav-links" routerLinkActive="active" routerLink="/home">Home</a></li>
              <li class="nav-item" routerLinkActive="active" style="cursor: pointer;"><a class="nav-link nav-links"
                  routerLink="/benefits">Benefits</a></li>
              <li class="nav-item" routerLinkActive="active" style="cursor: pointer;"><a class="nav-link nav-links"
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
<!-- breadcrumb start-->
<section class="breadcrumb breadcrumb_bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <div class="breadcrumb_iner">
          <div class="breadcrumb_iner_item">
            <h2>Features</h2>
            <!-- <p>Home<span>/</span>Features</p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- breadcrumb start-->
<section class="feature_part single_feature_part pb-4">
  <div class="container">
    <h3>Why DocsTime</h3>
    <br>
    <div class="row">
      <div class="col-sm-6 col-md-4 wow fadeInUp">
        <div class="services-item">
          <div class="item-content">
            <h4>Reminders</h4>
            <p>Now with DocTime, you never miss an appointment with your doctor. Let DocsTime remind you about your
              appointment. Get all updates on messages, mails or mobile.</p>
          </div>
        </div>
      </div>
      <br />
      <div class="col-sm-6 col-md-4 wow fadeInUp" data-wow-delay="0.1s">
        <div class="services-item">
          <div class="item-content">
            <h4>Privacy (HIPAA COMPLIANT)</h4>
            <p> We do respect your privacy. Our policies are strict. We do not collaborate with any advertisers. Our
              platform is free from any data sharing contracts. For more details you can check out our privacy policy in
              detail.</p>
          </div>
        </div>
      </div>
      <br />
      <div class="col-sm-6 col-md-4 wow fadeInUp" data-wow-delay="0.2s">
        <div class="services-item">
          <div class="item-content">
            <h4>The DocsTime privilege</h4>
            <p> Experience privilege with DocsTime. Enjoy excusive experience. You share a separate priority when you
              book your appointment with DocsTime. Don’t believe it? Try it now. </p>
          </div>
        </div>
      </div>
      <br />
      <div class="col-sm-6 col-md-4 wow fadeInUp" data-wow-delay="0.3s">
        <div class="services-item">
          <div class="item-content">
            <h4>Personalization</h4>
            <p> Manage your health all by yourself. Maintain your records on the go. Keep your prescriptions and other
              health records handy. </p>
          </div>
        </div>
      </div>
      <br />
      <div class="col-sm-6 col-md-4 wow fadeInUp" data-wow-delay="0.4s">
        <div class="services-item">
          <div class="item-content">
            <h4>Insurance compatibility</h4>
            <p> Let DocsTime take up the hassle. Be smart and search for doctors that are in your Insurance provider’s
              network. Stay smart. Download DocsTime now.</p>
          </div>
        </div>
      </div>
      <br />
      <div class="col-sm-6 col-md-4 wow fadeInUp" data-wow-delay="0.5s">
        <div class="services-item">
          <div class="item-content">
            <h4>Save time</h4>
            <p> Find the top physician near you. Choose from 300000+ physicians. Schedule your appointment at the time
              that works for you. Make use of the platform at anytime throughout the day.</p>
          </div>
        </div>
      </div>
      <br />
    </div>
  </div>
  <br>
</section>
<app-footer></app-footer>
  `,
  styles: [
    `.main_menu .main-menu-item ul li .nav-links { color: #000; }`,
    `.main_menu .main-menu-item ul li .nav-links:hover,
    .main_menu .main-menu-item ul li.active .nav-links {
    color: #89DAFF;
  }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureComponent implements OnInit {
  bsModalRef: BsModalRef;
  doctor: any;
  facility: any;
  constructor(
    private modalService: BsModalService,
    private service: HomeService,
    private cd: ChangeDetectorRef
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

