import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-footer',
  template: `
  <footer class="footer-area">
  <div class="footer">
    <div class="container">
      <div class="row justify-content-between">
        <div class="col-xl-5 col-lg-12 single-footer-widget pb-3 pb-xl-0">
          <h4 class="mb-3"><img [defaultImage]="'assets/img/logo-white2.png'" [lazyLoad]="'assets/img/logo-white2.png'" [errorImage]="'assets/img/logo-white2.png'" alt="logo" style="max-height:40px;"></h4>
          <div *ngIf="innerHTML$ | async as cmsContents">
            <div [innerHTML]="cmsContents[0].cmspageContents | safeHtml"></div>
          </div>
        </div>
        <div class="col-xl-2 col-6 col-sm-4 col-md-4 single-footer-widget">
          <h4>Quick Links</h4>
          <ul>
            <li><a routerLink="/home" routerLinkActive="active">Home</a></li>
            <li><a routerLink="about-us" routerLinkActive="active">About Us</a></li>
            <li><a routerLink="faq" routerLinkActive="active">FAQ</a></li>
          </ul>
        </div>
        <div class="col-xl-3 col-6 col-sm-4 col-md-4 single-footer-widget order-md-3 order-4">
          <h4>Are you a Provider?</h4>
          <ul>
            <li><a routerLink="join-docs-time" routerLinkActive="active">Join
                DocsTime</a></li>
          </ul>
        </div>
        <div class="col-xl-2 col-6 col-sm-4 col-md-4 single-footer-widget order-md-4 order-3">
          <h4>Need Help?</h4>
          <ul>
            <li><a routerLink="contact-us" routerLinkActive="active">Contact Us</a></li>
            <li><a routerLink="terms-and-conditions" routerLinkActive="active">Terms &
                Conditions</a></li>
            <li><a routerLink="privacy-policy" routerLinkActive="active">Privacy
                Policy</a></li>
            <li><a routerLink="doctors-privacy-policy" routerLinkActive="active">Doctors
                Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="copyright_part">
    <div class="container">
      <div class="row align-items-center">
        <p class="footer-text m-0 col-lg-10 col-md-12 text-center">&copy; 2021 DocsTime. All Rights Reserved.</p>
        <div class="col-lg-2 col-md-12 text-center text-lg-right footer-social">
          <a (click)="openFBpage()" style="cursor: pointer;"><i class="ti-facebook"></i></a>
          <a (click)="openTwitterpage()" style="cursor: pointer;"> <i class="ti-twitter-alt"></i>
          </a>
          <a (click)="openLinkedINpage()" style="cursor: pointer;"><i class="ti-linkedin"></i></a>
        </div>
      </div>
    </div>
  </div>
</footer>
  `,
  styles: [
  ]
})
export class FooterComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  footerOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    nav: false,
    merge: true,
    autoplay: true,
    dots: true,
    items: 1,
    responsive: {
      0: {
        items: 1
      },
      574: {
        items: 1
      },
      767: {
        items: 1
      },
      993: {
        items: 1
      }
    }
  };
  constructor(public service: HomeService) {}
  ngOnInit(): void {
    this.innerHTML$ = this.service.homeFooterContent;
  }
  openFBpage = () => {
    window.open('https://www.facebook.com/DocsTime-102916645040860');
  }
  openTwitterpage = () => {
    window.open('https://twitter.com/DocsTime?ref_src=twsrc%5Etfw');
  }
  openLinkedINpage = () => {
    window.open('https://www.linkedin.com/in/docs-time-313818201');
  }
}
