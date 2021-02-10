import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { LoginSignupModalComponent } from './login-signup-modal/login-signup-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeService } from './home.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import * as $ from 'jquery';
import { ToastrModule } from 'ngx-toastr';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FacilityLoginSignupComponent } from './facility-login-signup/facility-login-signup.component';
import { FacilityForgetPasswordComponent } from './facility-forget-password/facility-forget-password.component';
import { FacilityResetPasswordComponent } from './facility-reset-password/facility-reset-password.component';
import { FacilityOtpVerificationComponent } from './facility-otp-verification/facility-otp-verification.component';
import { SignupDocComponent } from './signup-doc/signup-doc.component';
import { DoctorForgetPasswordComponent } from './doctor-forget-password/doctor-forget-password.component';
import { DoctorResetPasswordComponent } from './doctor-reset-password/doctor-reset-password.component';
import { DoctorOtpVerificationComponent } from './doctor-otp-verification/doctor-otp-verification.component';
import { DoctorSetPasswordComponent } from './doctor-set-password/doctor-set-password.component';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { environment } from '../environments/environment';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RequestModalComponent } from './request-modal/request-modal.component';
import { AgmCoreModule } from '@agm/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { LocationService } from './location.service';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ShareModule } from 'ngx-sharebuttons';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { SafeHtmlPipe } from './cms.pipe';
import { BenefitComponent } from './benefit/benefit.component';
import { FeatureComponent } from './feature/feature.component';
import { UsersModalComponent } from './users-modal/users-modal.component';
import { ListPracticeComponent } from './list-practice/list-practice.component';
import { ErrorNotFoundComponent } from './error-not-found/error-not-found.component';
import { ConfirmationPopUpComponent } from './confirmation-pop-up/confirmation-pop-up.component';
const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: environment.cookieDomain
  },
  position: 'bottom',
  theme: 'classic',
  palette: {
    popup: {
      background: '#000000',
      text: '#ffffff',
      link: '#ffffff'
    },
    button: {
      background: '#0783ff',
      text: '#ffffff',
      border: 'transparent'
    }
  },
  type: 'info',
  content: {
    message: 'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: 'Got it!',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: 'https://www.docstime.com/content/privacy-policy',
    policy: 'Privacy Policy'
  }
};
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    LoginSignupModalComponent,
    FacilityLoginSignupComponent,
    FacilityForgetPasswordComponent,
    FacilityResetPasswordComponent,
    FacilityOtpVerificationComponent,
    SignupDocComponent,
    DoctorForgetPasswordComponent,
    DoctorResetPasswordComponent,
    DoctorOtpVerificationComponent,
    DoctorSetPasswordComponent,
    RequestModalComponent,
    SafeHtmlPipe,
    BenefitComponent,
    FeatureComponent,
    UsersModalComponent,
    ListPracticeComponent,
    ErrorNotFoundComponent,
    ConfirmationPopUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgcCookieConsentModule.forRoot(cookieConfig),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    LazyLoadImageModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    InfiniteScrollModule,
    NgxCaptchaModule,
    ShareModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAV0j-imLFwoEcRaCTHDVl0o9Tj6Mj7fZM'
    }),
    ToastrModule
    .forRoot(
    {
      positionClass: 'toast-center-center',
      timeOut: 3000,
      preventDuplicates: true,
      maxOpened: 1,
      easeTime: 0,
    }
    ),
    NgIdleKeepaliveModule.forRoot(),
    GooglePlaceModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [HomeService, LocationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
