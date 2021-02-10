import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HomeService } from '../home.service';
import { UsersModalComponent } from '../users-modal/users-modal.component';

@Component({
  selector: 'app-benefit',
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
            <h2>Benefits</h2>
            <p>Home<span>/</span>Benefits</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- breadcrumb start-->
<section class="feature_part single_feature_part">
  <div class="container">
    <div id="future-slider" class="carousel slide" data-ride="carousel">
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-0">
          <div class="about-content-left left-section-futur">
            <div class="single-feature mb-4" data-target="#future-slider" data-slide-to="0">
              <div class="icon-box-wrap d-flex flex-md-row-reverse align-items-center">
                <div class="ml-auto icon-box">
                  <span class="box-icon1"></span>
                </div>
                <p class="mb-0 ml-auto"><b class="text-dark">Boost your revenue</b><br>Be a part of 300000 medical
                  practitioners. Get referred and fill up all your empty slots. Be more discoverable on real time bases.
                  Get ad hoc appointments on a real time bases. Be smart. Be on DocsTime.</p>
              </div>
            </div>
            <div class="single-feature mb-4" data-target="#future-slider" data-slide-to="1">
              <div class="icon-box-wrap d-flex flex-md-row-reverse align-items-center">
                <div class="ml-auto icon-box ">
                  <span class="box-icon2"></span>
                </div>
                <p class="mb-0"><b class="text-dark">No contractual obligation</b><br> Download DocsTime and start
                  filling up your slots now. There are no contractual obligations. DocsTime offers unlimited services
                  free. All you need to do is a free signup. Sounds amazing. Isn’t it? So then let us get started.</p>
              </div>
              <p></p>
            </div>
            <div class="single-feature mb-4" data-target="#future-slider" data-slide-to="2">
              <div class="icon-box-wrap d-flex flex-md-row-reverse align-items-center">
                <div class="ml-auto icon-box">
                  <span class="box-icon3"></span>
                </div>
                <p class="mb-0"><b class="text-dark">Instant referral</b><br> Troubled with fax and phone tagging? Not
                  anymore. Download the most simple referral application on the planet. Be where all doctors are.
                  Download DocsTime now.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 d-none d-lg-block">
          <div class="about-content-right">
            <img [defaultImage]="'assets/img/top_service.png'" [lazyLoad]="'assets/img/top_service.png'"
              [errorImage]="'assets/img/top_service.png'" class="img-fluid">
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="about-content-left right-section-futur">
            <div class="single-feature mb-4" data-target="#future-slider" data-slide-to="3">
              <div class="icon-box-wrap d-flex align-items-center">
                <div class="icon-box">
                  <span class="box-icon4"></span>
                </div>
                <p class="mb-0"><b class="text-dark">Access EMR/EHR</b><br>DocsTime offers seamless integration with all
                  the EMR and EHR platforms. Now access any health record in just a moment. Browse through patient
                  medical records with artificial intelligence reporting system. Make smarter decisions with better
                  diagnosis. </p>
              </div>
            </div>
            <div class="single-feature mb-4" data-target="#future-slider" data-slide-to="4">
              <div class="icon-box-wrap d-flex align-items-center">
                <div class="icon-box">
                  <span class="box-icon5"></span>
                </div>
                <p class="mb-0"><b class="text-dark">Boutique Services</b><br> Let DocsTime do the insurance
                  compatibility on real time bases. Focus on what really matter – “Patient care.” Leave the rest on
                  DocsTime. Be smart and let the application manage what insurance you accept. Sounds interesting. Isn’t
                  it? Download now.</p>
              </div>
              <p></p>
            </div>
            <div class="single-feature mb-4" data-target="#future-slider" data-slide-to="5">
              <div class="icon-box-wrap d-flex align-items-center">
                <div class="icon-box">
                  <span class="box-icon6"></span>
                </div>
                <p class="mb-0"><b class="text-dark">Manage your calendars smartly</b><br> Get appointments on real time
                  bases in cancelled and no-show slots. Also, get back the referred patient when they need your help.
                  Download DocsTime now and enhance your productivity. </p>
              </div>
              <p></p>
            </div>
          </div>
        </div>
      </div>
      <div class="about-content-left right-section-futur">
        <div class="single-feature mb-4 " data-target="#future-slider" data-slide-to="3">
          <div class="icon-box-wrap d-flex align-items-center">
            <div class="icon-box">
              <span class="box-icon4"></span>
            </div>
            <p class="mb-0"><b class="text-dark">Become a digital authority</b><br>Yes. You heard it right. With
              DocsTime you get ratings and reviews from your real patients. Get noticed in the entire medical fraternity
              with those amazing patient feedbacks. Let your credentials talk for you. </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<app-footer></app-footer>
  `,
  styles: [
    `.main_menu .main-menu-item ul li .nav-links {color: #000;}`,
    `.main_menu .main-menu-item ul li .nav-links:hover,
    .main_menu .main-menu-item ul li.active .nav-links {
      color: #89DAFF;
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BenefitComponent implements OnInit {
  bsModalRef: BsModalRef;
  doctor: any;
  facility: any;
  constructor(
    private modalService: BsModalService,
    private service: HomeService,
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
