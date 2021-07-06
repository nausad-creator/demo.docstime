import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-fac-faq',
  template: `<!-- breadcrumb start-->
  <section class="breadcrumb breadcrumb_bg">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="breadcrumb_iner">
              <div class="breadcrumb_iner_item">
                <h2>FAQ'S</h2>
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
            <div id="accordion" *ngIf="innerHTML$ | async as cmsContents">
              <div class="card" *ngFor="let item of cmsContents; index as i">
                <div class="card-header" id="1">
                  <h5 class="mb-0">
                    <button class="btn btn-link collapsed" data-toggle="collapse" [attr.data-target]="'#test' + i"
                      aria-expanded="false" aria-controls="1">{{item.faqQuestion}}</button>
                  </h5>
                </div>
                <div id="test{{i}}" class="collapse" aria-labelledby="1" data-parent="#accordion">
                  <div class="card-body" [innerHTML]="item.faqAnswer | cms">
                  </div>
                </div>
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
              <div class="row" style="margin-top: 40px; height: 500px;">
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
  styles: [``]
})
export class FacFaqComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService) {}
  ngOnInit(): void {
    this.innerHTML$ = this.service.getFaq;
  }
}
