import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-about-content',
  template: `
  <!-- breadcrumb start-->
  <section class="breadcrumb breadcrumb_bg">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb_iner">
            <div class="breadcrumb_iner_item" *ngIf="innerHTML$ | async as cmsContent">
              <h2>About Us</h2>
              <!-- <p>Home<span>/</span>{{cmsContent[0].cmspageName | titlecase}}</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- our_ability part start-->
  <section class="about_us section_padding">
    <div class="container">
          <div class="" *ngIf="innerHTML$ | async as cmsContent">
            <div [innerHTML]="cmsContent[0].cmspageContents | safeHtml">
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
  <!-- our_ability part end-->
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutContentComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService,
    private cd: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsAbout;
    this.cd.markForCheck();
  }
}
