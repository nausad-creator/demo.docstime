import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-terms',
  template: `
  <!-- breadcrumb start-->
  <section class="breadcrumb breadcrumb_bg">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb_iner">
            <div class="breadcrumb_iner_item" *ngIf="innerHTML$ | async as cmsContent">
              <h2>{{cmsContent[0].cmspageName | titlecase}}</h2>
              <!-- <p>Home<span>/</span>{{cmsContent[0].cmspageName | titlecase}}</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- breadcrumb start-->
  <section class="feature_part single_feature_part">
    <div class="container">
      <div class="row">
        <div class="col-xl-12 col-md-12 align-self-center">
          <div class="section_title" *ngIf="innerHTML$ | async as cmsContents">
            <div [innerHTML]="cmsContents[0].cmspageContents | safeHtml">
            </div>
          </div>
          <div class="container" *ngIf="(innerHTML$ | async) === null">
            <div class="row" style="margin-top: 40px; height: 500px;">
              <div class="col">
                <p class="text-center">Loading...</p>
              </div>
            </div>
          </div>
          <div class="container" *ngIf="(innerHTML$ | async) === undefined">
            <div class="row" style="margin-top: 40px;">
              <div class="col">
                <p class="text-center">No Content Found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsTermsAndConditions;
    this.cd.markForCheck();
  }
}
