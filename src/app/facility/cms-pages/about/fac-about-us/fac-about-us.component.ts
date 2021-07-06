import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-fac-about-us',
  template: `<!-- breadcrumb start-->
  <section class="breadcrumb breadcrumb_bg">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="breadcrumb_iner">
              <div class="breadcrumb_iner_item">
                <h2>About Us</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- breadcrumb start-->
    <!-- our_ability part start-->
    <section class="about_us section_padding">
      <div class="container">
            <div class="" *ngIf="innerHTML$ | async as cmsContent">
              <div [innerHTML]="cmsContent[0].cmspageContents | cms">
              </div>
        </div>
        <div class="" *ngIf="(innerHTML$ | async) === null">
          <div class="">
            <div style="margin-top: 30px; min-height: 500px;">
              <p class="text-center">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- our_ability part end-->`,
  styles: []
})
export class FacAboutUsComponent implements OnInit {
  footerOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    nav: false,
    merge: true,
    autoplay: true, // Set AutoPlay to 3 seconds
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
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService
  ) { }
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsAbout;
  }
}
