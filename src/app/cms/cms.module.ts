import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsRoutingModule } from './cms-routing.module';
import { ContentComponent } from './content/content.component';
import { SafeHtmlPipe } from './cms.pipe';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AboutContentComponent } from './about-content/about-content.component';
import { FaqContentComponent } from './faq-content/faq-content.component';
import { JoinDocsComponent } from './join-docs/join-docs.component';
import { PolicyComponent } from './policy/policy.component';
import { PolicyDoctorComponent } from './policy-doctor/policy-doctor.component';
import { TermsComponent } from './terms/terms.component';
import { ContactDocstimeComponent } from './contact-docstime/contact-docstime.component';


@NgModule({
  declarations: [
    ContentComponent,
    SafeHtmlPipe,
    HeaderComponent,
    FooterComponent,
    AboutContentComponent,
    FaqContentComponent,
    JoinDocsComponent,
    PolicyComponent,
    PolicyDoctorComponent,
    TermsComponent,
    ContactDocstimeComponent
  ],
  imports: [
    CommonModule,
    CmsRoutingModule,
    NgSelectModule,
    LazyLoadImageModule,
    NgxSpinnerModule,
    CarouselModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    FormsModule,
    GooglePlaceModule
  ]
})
export class CmsModule { }
