import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HomeService } from '../home.service';
import { UsersModalComponent } from '../users-modal/users-modal.component';

@Component({
  selector: 'app-list-practice',
  template: `
  <header class="main_menu home_menu border-0">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-12">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" routerLinkActive="active" routerLink="/home">
            <img [defaultImage]="'assets/img/logo-white.png'" [lazyLoad]="'assets/img/logo-white.png'"
              [errorImage]="'assets/img/logo-white.png'" class="logo-white" alt="logo" height="70">
              <img [defaultImage]="'assets/img/logo-white.png'" [lazyLoad]="'assets/img/logo-white.png'"
              [errorImage]="'assets/img/logo-white.png'" class="logo-blue" alt="logo">
            </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span></button>
          <div class="collapse navbar-collapse main-menu-item justify-content-end" id="navbarSupportedContent">
            <ul class="navbar-nav align-items-center">
              <li class="nav-item"><a class="nav-link" routerLinkActive="active"
                  routerLink="/home">Home</a></li>
              <li class="nav-item" routerLinkActive="active" style="cursor: pointer;"><a
                  class="nav-link" routerLink="/benefits">Benefits</a></li>
              <li class="nav-item" routerLinkActive="active" style="cursor: pointer;"><a
                  class="nav-link" routerLink="/features">Features</a></li>
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

<section class="banner-landingpage" style="background-image:url(assets/img/banner-landing.jpg);min-height: 400px;">
  <div class="container">
    <div class="banner-content text-center banner-landing-content">
      <div class="banner_text">
        <div class="banner_text_iner">
          <h1 class="wow fadeInUp text-white mb-0" data-wow-delay="0.2s">Search for a Doctor, Make Appointment</h1>
          <p class="wow fadeInUp text-white mb-0" data-wow-delay="0.4s">Discover the best doctors, clinics and hospitals near you.</p>
          <div class="wow fadeInUp mt-4 list_practice">
            <a routerLink="/content/join-docs-time" type="submit" class="button btn_1">Join DocsTime</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- <section class="banner-landingpage" style="background-image:url(assets/img/banner-landing.jpg);">
  <div class="container">
    <div class="banner-content text-center banner-landing-content">
      <div class="banner_text">
        <div class="banner_text_iner"> -->
          <!-- <h1 class="wow fadeInUp text-white mb-0" data-wow-delay="0.2s">Search for a Doctor, Make an Appointment</h1> -->
          <!-- <p class="wow fadeInUp text-white mb-0" data-wow-delay="0.4s">Discover the best doctors, clinics and hospitals near you.</p> -->
        <!-- </div>
      </div>
      <div class="pt-5 pb-5 wow fadeIn" data-wow-delay="0.8s">
        <div class="searchbox-content">
          <form> -->
            <!-- <div class="form-row m-0">
              <div class="form-group col first-colum">
                <span class="lbels"><i class="ti-search"></i></span>
                <input type="text" class="form-control" id="reason" placeholder="Reason for consultation">
              </div>
              <div class="form-group col second-colum Specialty-dropdown">
                <span class="lbels"><img [defaultImage]="'assets/img/specialty-icon.png'"
                    [lazyLoad]="'assets/img/specialty-icon.png'" [errorImage]="'assets/img/specialty-icon.png'"
                    alt="Specialty" height="20"></span> -->
                <!--<input type="text" class="form-control" id="speciality" placeholder="Specialty">-->
                <!-- <select class="form-control select2">
                  <option selected="selected">Specialty</option>
                  <option> Primary Care</option>
                  <option> Dentist</option>
                  <option> Urology</option>
                  <option> Dermatology</option>
                  <option> Eye Doctor</option>
                  <option> Cardiology</option>
                </select>
              </div> -->
              <!-- <div class="form-group col Specialty-dropdown">
                <span class="lbels" style="font-size: 16px;"><i class="ti-location-pin"></i></span> -->
                <!--<input type="text" class="form-control" id="city" placeholder="City or Zip Code">-->
                <!-- <select class="form-control select2">
                  <option selected="selected">City or Zip Code</option>
                  <option>Surat Gujrat, India </option>
                  <option>Rajkot Gujrat, India</option>
                  <option>Bhavnagar Gujrat, India</option>
                  <option>JamnagarGujrat, India</option>
                  <option>Mahesana Gujrat, India</option>
                  <option>Baroda Gujrat, India</option>
                </select>
              </div>
              <div class="form-group col">
                <span class="lbels" style="cursor: pointer;" [owlDateTimeTrigger]="dt3"><img [defaultImage]="'assets/img/date-icon.png'"
                    [lazyLoad]="'assets/img/date-icon.png'" [errorImage]="'assets/img/date-icon.png'" alt="Specialty"
                    height="18"></span>
                <input class="form-control" oninput="this.value = this.value.trim()"
                name="currentDate" [owlDateTime]="dt3" [(ngModel)]="currentDate" id="date"
                 placeholder="Date of Appointment">
                  <owl-date-time [pickerType]="'calendar'" #dt3></owl-date-time> -->
                <!--<input type="date" class="form-control" id="date" placeholder="Date of Appointment" onfocus="(this.type='date')" onblur="(this.type='text')">-->
              <!-- </div>
              <div class="form-group col">
                <span class="lbels"><img [defaultImage]="'assets/img/insurance-icon.png'"
                    [lazyLoad]="'assets/img/insurance-icon.png'" [errorImage]="'assets/img/insurance-icon.png'"
                    alt="Specialty" height="20"></span>
                <input type="text" class="form-control" id="insurance" placeholder="Insurance(Optional)">
              </div> -->
              <!-- <div class="form-group search-btn-box">
                <a class="search-go"><i class="ti-search"></i></a>
              </div>
            </div> -->
          <!-- </form>
        </div>
      </div>
    </div>
  </div>
</section> -->
<section class="category-section">
  <div class="container">
    <br>
    <div class="section_title text-center" style="font-color:#242424;">
      <h2 class="wow fadeIn text-dark" data-wow-delay="0.6s">Browse doctor by specialities</h2>
    </div><br><br>
    <div class="">
      <div id="owl-demo" class="owl-carousel owl-category">
        <div class="item wow fadeInUp" data-wow-delay="0.2s">
          <a  class="category-items">
            <img [defaultImage]="'assets/img/primary-care-icon.png'" [lazyLoad]="'assets/img/primary-care-icon.png'"
              [errorImage]="'assets/img/primary-care-icon.png'" alt="category">
            <h4> Primary Care</h4>
          </a>
        </div>
        <div class="item wow fadeInUp" data-wow-delay="0.4s">
          <a  class="category-items">
            <img [defaultImage]="'assets/img/dentist-icon.png'" [lazyLoad]="'assets/img/dentist-icon.png'"
              [errorImage]="'assets/img/dentist-icon.png'" alt="category">
            <h4> Dentist</h4>
          </a>
        </div>
        <div class="item wow fadeInUp" data-wow-delay="0.6s">
          <a  class="category-items">
            <img [defaultImage]="'assets/img/urology-icon.png'" [lazyLoad]="'assets/img/urology-icon.png'"
              [errorImage]="'assets/img/urology-icon.png'" alt="category">
            <h4> Urology</h4>
          </a>
        </div>
        <div class="item wow fadeInUp" data-wow-delay="0.8s">
          <a  class="category-items">
            <img [defaultImage]="'assets/img/dermatologist-icon.png'" [lazyLoad]="'assets/img/dermatologist-icon.png'"
              [errorImage]="'assets/img/dermatologist-icon.png'" alt="category">
            <h4> Dermatology</h4>
          </a>
        </div>
        <div class="item wow fadeInUp" data-wow-delay="1.0s">
          <a  class="category-items">
            <img [defaultImage]="'assets/img/eye-doctor-icon.png'" [lazyLoad]="'assets/img/eye-doctor-icon.png'"
              [errorImage]="'assets/img/eye-doctor-icon.png'" alt="category">
            <h4> Eye Doctor</h4>
          </a>
        </div>
        <div class="item wow fadeInUp" data-wow-delay="1.2s">
          <a  class="category-items">
            <img [defaultImage]="'assets/img/cardiologist-icon.png'" [lazyLoad]="'assets/img/cardiologist-icon.png'"
              [errorImage]="'assets/img/cardiologist-icon.png'" alt="category">
            <h4> Cardiology</h4>
          </a>
        </div>
        <div class="item wow fadeInUp" data-wow-delay="1.4s">
          <a  class="category-items">
            <img [defaultImage]="'assets/img/primary-care-icon.png'" [lazyLoad]="'assets/img/primary-care-icon.png'"
              [errorImage]="'assets/img/primary-care-icon.png'" alt="category">
            <h4> Primary Care</h4>
          </a>
        </div>
        <div class="item wow fadeInUp" data-wow-delay="1.6s">
          <a  class="category-items">
            <img [defaultImage]="'assets/img/dentist-icon.png'" [lazyLoad]="'assets/img/dentist-icon.png'"
              [errorImage]="'assets/img/dentist-icon.png'" alt="category">
            <h4> Dentist</h4>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<br>
<section class="category-section pb-4">
  <div class="container">
    <br>
    <div class="section_title text-center" style="font-color:#242424;">
      <h2 class="wow fadeIn text-dark" data-wow-delay="0.6s">How To Book with DocsTime?</h2>
    </div><br><br>
    <div class="row">
      <div class="col-md-4 wow fadeInUp" data-wow-delay="0.2s">
        <div class="bookin-stap-list">
          <img [defaultImage]="'assets/img/search-img.png'" [lazyLoad]="'assets/img/search-img.png'"
            [errorImage]="'assets/img/search-img.png'" alt="Search">
          <h4 class="mb-0">Search for doctor</h4>
          <p>By Specialty, area, doctor name or Fees</p>
        </div>
      </div>
      <div class="col-md-4 wow fadeInUp" data-wow-delay="0.4s">
        <div class="bookin-stap-list">
          <img [defaultImage]="'assets/img/choose-img.png'" [lazyLoad]="'assets/img/choose-img.png'"
            [errorImage]="'assets/img/choose-img.png'" alt="Choose">
          <h4 class="mb-0">Compare reviews</h4>
          <p>Based on real patients reviews</p>
        </div>
      </div>
      <div class="col-md-4 wow fadeInUp" data-wow-delay="0.6s">
        <div class="bookin-stap-list">
          <img [defaultImage]="'assets/img/book-appointment-img.png'" [lazyLoad]="'assets/img/book-appointment-img.png'"
            [errorImage]="'assets/img/book-appointment-img.png'" alt="Book">
          <h4 class="mb-0">Schedule an appointment</h4>
          <p>Anytime, Anywhere</p>
        </div>
      </div>
    </div>
  </div>
</section>
<br>
<section class="regervation_part wow fadeInUp pt-5" data-wow-delay="0.2s">
  <div class="container">
    <div class="row justify-content-between align-items-center">
      <div class="col-md-6 col-lg-4">
        <div class="download-mocup text-center wow fadeInUp" data-wow-delay="0.6s">
          <img [defaultImage]="'assets/img/download-mocup.png'" [lazyLoad]="'assets/img/download-mocup.png'"
            [errorImage]="'assets/img/download-mocup.png'" alt="" style="max-height:400px;">
        </div>
      </div>
      <div class="col-md-6 col-lg-8">
        <div class="Download_title">
          <h2 class="wow fadeIn" data-wow-delay="0.6s"> Make informed health care decisions. Download DocsTime now.</h2>
        </div>

        <div class="content-download">
          <ul class="wow fadeInUp" data-wow-delay="0.4s">
            <!-- <li>Reach out to the best practitioner.</li>
            <li>Schedule your appointment based on your time availability and location.</li>
            <li>Plan your check up any time of the day.</li> -->
          </ul>
          <div class="download-btns">
            <a (click)="openIosStore()" target="_blank" class="wow fadeInUp cursr" data-wow-delay="0.6s">
              <img [defaultImage]="'assets/img/appstore.png'" [lazyLoad]="'assets/img/appstore.png'"
                [errorImage]="'assets/img/appstore.png'" alt="appstore"></a>
            <a (click)="openAndroidStore()" target="_blank" class="wow fadeInUp cursr" style="margin-left: 6px;" data-wow-delay="0.8s">
              <img [defaultImage]="'assets/img/playstore.png'" [lazyLoad]="'assets/img/playstore.png'"
                [errorImage]="'assets/img/playstore.png'" alt="playstore"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!---------------------------- Testimonial -------------------->
<section id="testimonials" class="testimonials pt-4 ">
  <div class="container">
    <div class="section-title">
      <!--<h3>Testimonials</h3>-->
      <h2>Look what Clients have to say about us.</h2>
      <p>Our award winning reputation & achievement is founded on exceeding the expectation of our clients.</p>
    </div>
    <div class="owl-carousel testimonials-carousel">
      <div class="testimonial-items">
        <p><img class="quoteacons" style="width: 35px;" [defaultImage]="'assets/img/quote.png'"
            [lazyLoad]="'assets/img/quote.png'" [errorImage]="'assets/img/quote.png'" alt="quote">
          <span style="padding-left:43px;" class="position-relative"> schedule throughout the week. I often skip my appointments because of prior
            commitments. This has resulted in many complications in the past. However, with DocsTime I was able to
            schedule appointments just any time of the day. I could choose my physician as a time I could manage to
            visit. In fact, DocsTime helps you find doctors in your immediate vicinity.</span>
          <b>– David ******</b>
        </p>
        <img [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="'assets/img/user-icon.png'"
          [errorImage]="'assets/img/user-icon.png'" class="testimonial-img" alt="">
      </div>
      <div class="testimonial-items">
        <p><img class="quoteacons" style="width: 35px;" [defaultImage]="'assets/img/quote.png'"
            [lazyLoad]="'assets/img/quote.png'" [errorImage]="'assets/img/quote.png'" alt="quote">
          <span style="padding-left:43px;" class="position-relative">I visited my PCP for abdominal pain. My doctor told me that I need to see
            Gastroenterologist. Earlier I used to call multiple offices to schedule an appointment that suites my time.
            First thing it was difficult to reach them on the phone right away second thing even if I am able to catch
            hold of them I am unable to schedule the time I need. With DocsTime app I was able to get an appointment
            with the best specialists around with in minuites. Thanks for the features provided.</span> <b>"Ellen"</b>
        </p>
        <img [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="'assets/img/user-icon.png'"
          [errorImage]="'assets/img/user-icon.png'" class="testimonial-img" alt="">
      </div>
      <div class="testimonial-items">
        <p><img class="quoteacons" style="width: 35px;" [defaultImage]="'assets/img/quote.png'"
            [lazyLoad]="'assets/img/quote.png'" [errorImage]="'assets/img/quote.png'" alt="quote">
          <span style="padding-left:43px;" class="position-relative">I visited my PCP for abdominal pain. My doctor told me that I need to see
            Gastroenterologist. Earlier I used to call multiple offices to schedule an appointment that suites my time.
            First thing it was difficult to reach them on the phone right away second thing even if I am able to catch
            hold of them I am unable to schedule the time I need. With DocsTime app I was able to get an appointment
            with the best specialists around with in minuites. Thanks for the features provided.</span> <b>"Ally"</b>
        </p>
        <img [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="'assets/img/user-icon.png'"
          [errorImage]="'assets/img/user-icon.png'" class="testimonial-img" alt="">
      </div>
      <div class="testimonial-items">
        <p><img class="quoteacons" style="width: 35px;" [defaultImage]="'assets/img/quote.png'"
            [lazyLoad]="'assets/img/quote.png'" [errorImage]="'assets/img/quote.png'" alt="quote">
          <span style="padding-left:43px;" class="position-relative"> schedule throughout the week. I often skip my appointments because of prior
            commitments. This has resulted in many complications in the past. However, with DocsTime I was able to
            schedule appointments just any time of the day. I could choose my physician as a time I could manage to
            visit. In fact, DocsTime helps you find doctors in your immediate vicinity.</span>
          <b>– David ******</b>
        </p>
        <img [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="'assets/img/user-icon.png'"
          [errorImage]="'assets/img/user-icon.png'" class="testimonial-img" alt="">
      </div>
      <div class="testimonial-items">
        <p><img class="quoteacons" style="width: 35px;" [defaultImage]="'assets/img/quote.png'"
            [lazyLoad]="'assets/img/quote.png'" [errorImage]="'assets/img/quote.png'" alt="quote">
          <span style="padding-left:43px;" class="position-relative">I visited my PCP for abdominal pain. My doctor told me that I need to see
            Gastroenterologist. Earlier I used to call multiple offices to schedule an appointment that suites my time.
            First thing it was difficult to reach them on the phone right away second thing even if I am able to catch
            hold of them I am unable to schedule the time I need. With DocsTime app I was able to get an appointment
            with the best specialists around with in minuites. Thanks for the features provided.</span> <b>"Ally"</b>
        </p>
        <img [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="'assets/img/user-icon.png'"
          [errorImage]="'assets/img/user-icon.png'" class="testimonial-img" alt="">
      </div>
    </div>
  </div>
</section>
<app-footer></app-footer>
<ngx-spinner [fullScreen]="true" color="#fff" type="" bdColor="rgba(0, 0, 0, 0.9)">
  <div class="loader">
    <img class="logo-icon" [defaultImage]="'assets/img/favicon.png'" [lazyLoad]="'assets/img/favicon.png'" [errorImage]="'assets/img/favicon.png'" alt="DocsTime"><span>Loading...</span>
  </div>
</ngx-spinner>
  `,
  styles: [
    `.cursr{
      cursor: pointer;
  }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPracticeComponent implements OnInit {
  bsModalRef: BsModalRef;
  doctor: any;
  facility: any;
  currentDate = new Date();
  constructor(
    private modalService: BsModalService,
    private service: HomeService,
    private cd: ChangeDetectorRef,
  ) { }
  openAsk = () => {
    this.bsModalRef = this.modalService.show(UsersModalComponent, { id: 221 });
  }
  ngOnInit(): void {
    jQuery(() => {
      ($('.owl-category') as any).owlCarousel({
        nav: true,
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        autoPlay: 3000, // Set AutoPlay to 3 seconds
        dots: true,
        items: 6,
        responsive: {
          0: {
            items: 2
          },
          574: {
            items: 3
          },
          767: {
            items: 4
          },
          993: {
            items: 6
          }
        }
      });
      ($('.testimonials-carousel') as any).owlCarousel({
        loop: true,
        margin: 10,
        items: 2,
        nav: true,
        responsiveClass: true,
        navText: ['<i class=\'ti-angle-left\'></i>', '<i class=\'ti-angle-right\'></i>'],
        responsive: {
          0: {
            items: 1,
            nav: true
          },
          600: {
            items: 1,
            nav: false
          },
          1000: {
            items: 2,
            nav: true,
            loop: false
          }
        }
      });
    });
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
  openAndroidStore = () => {
    window.open('https://play.google.com/store/apps/details?id=com.DocsFacility', '_blank_UNIQUE_WINDOW1');
    window.open('https://play.google.com/store/apps/details?id=com.DocsRefer', '_blank_MORE_UNIQUE_WINDOW5');
  }
  openIosStore = () => {
    window.open('https://apps.apple.com/us/app/docsfacility/id1523636906', '_blank_IOS_STORE_FACILITY');
    window.open('https://apps.apple.com/us/app/docsrefer/id1523636918', '_blank_IOS_STORE_REFER');
  }
}
