import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityDashboardComponent } from './facility-dashboard/facility-dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FacilityService } from './facility.service';
import { SharedTodayAppointmentComponent } from './shared-today-appointment/shared-today-appointment.component';
import { SharedNewAppointmentComponent } from './shared-new-appointment/shared-new-appointment.component';
import { ConfirmedReceivedModalComponent } from './confirmed-received-modal/confirmed-received-modal.component';
import { RejectReceivedModalComponent } from './reject-received-modal/reject-received-modal.component';
import { ShareDatetimepickerComponent } from './share-datetimepicker/share-datetimepicker.component';
import { ShareReferralReceivedComponent } from './share-referral-received/share-referral-received.component';
import { ShareReferralSentComponent } from './share-referral-sent/share-referral-sent.component';
import { SharedOndatetimeScheduledComponent } from './shared-ondatetime-scheduled/shared-ondatetime-scheduled.component';
import { PreviousAppointmentComponent } from './previous-appointment/previous-appointment.component';
import { FacilityMyProfileComponent } from './facility-my-profile/facility-my-profile.component';
import { FacilityMyScheduleComponent } from './facility-my-schedule/facility-my-schedule.component';
import { FacilityNotificationSettingComponent } from './facility-notification-setting/facility-notification-setting.component';
import { FacilityReferralReceivedComponent } from './facility-referral-received/facility-referral-received.component';
import { FacilityReferralSentComponent } from './facility-referral-sent/facility-referral-sent.component';
import { FacilityChangePasswordComponent } from './facility-change-password/facility-change-password.component';
import { ConverUrlPipe } from './conver-url.pipe';
import { ShareScheduleAppointmentsComponent } from './share-schedule-appointments/share-schedule-appointments.component';
import { ShareCancelledComponent } from './share-cancelled/share-cancelled.component';
import { SharedNotificationComponent } from './shared-notification/shared-notification.component';
import { NotificationFacilityComponent } from './notification-facility/notification-facility.component';
import { DoctorsListingComponent } from './doctors-listing/doctors-listing.component';
import { NpiModalComponent } from './npi-modal/npi-modal.component';
import { SharedListDoctorsComponent } from './shared-list-doctors/shared-list-doctors.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ViewReferComponent } from './view-refer/view-refer.component';
import { ReReferFormComponent } from './re-refer-form/re-refer-form.component';
import { AddReferFormComponent } from './add-refer-form/add-refer-form.component';
import { DortorViewComponent } from './dortor-view/dortor-view.component';
import { UpcommingComponent } from './upcomming/upcomming.component';
import { PreviousComponent } from './previous/previous.component';
import { CancelledComponent } from './cancelled/cancelled.component';
import { MyScheduledViewReferComponent } from './my-scheduled-view-refer/my-scheduled-view-refer.component';
import { MyScheduledReReferComponent } from './my-scheduled-re-refer/my-scheduled-re-refer.component';
import {NgcCookieConsentModule} from 'ngx-cookieconsent';
import { AddOrExistingDoctorModalComponent } from './add-or-existing-doctor-modal/add-or-existing-doctor-modal.component';
import { AddDoctorResetPasswordModalComponent } from './add-doctor-reset-password-modal/add-doctor-reset-password-modal.component';
import { SortByTimePipe } from './sort-by-time.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FacilityNavComponent } from './facility-nav/facility-nav.component';
import { FacilityComponent } from './facility/facility.component';
import { FacilityFooterComponent } from './facility-footer/facility-footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FacAboutUsComponent } from './fac-about-us/fac-about-us.component';
import { FacContactUsComponent } from './fac-contact-us/fac-contact-us.component';
import { FacPrivacyPolicyComponent } from './fac-privacy-policy/fac-privacy-policy.component';
import { FacFaqComponent } from './fac-faq/fac-faq.component';
import { FacTermsComponent } from './fac-terms/fac-terms.component';
import { FacPrivacyDoctorComponent } from './fac-privacy-doctor/fac-privacy-doctor.component';
import { FacJoinsComponent } from './fac-joins/fac-joins.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimesCircle, faShare } from '@fortawesome/free-solid-svg-icons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsPopupModule } from 'ngx-sharebuttons/popup';
import { Store } from './store.service';
import { ReReferStoreGuard } from './re-refer-store.guard';
import { StoreGuard } from './store.guard';
import { FacilityRoutingModule } from './facility.routing.module';
import { CmsPipe } from './cms.pipe';

@NgModule({
  declarations: [
    FacilityDashboardComponent,
    SharedTodayAppointmentComponent,
    SharedNewAppointmentComponent,
    ConfirmedReceivedModalComponent,
    RejectReceivedModalComponent,
    ShareDatetimepickerComponent,
    ShareReferralReceivedComponent,
    ShareReferralSentComponent,
    SharedOndatetimeScheduledComponent,
    PreviousAppointmentComponent,
    FacilityMyProfileComponent,
    FacilityMyScheduleComponent,
    FacilityNotificationSettingComponent,
    FacilityReferralReceivedComponent,
    FacilityReferralSentComponent,
    FacilityChangePasswordComponent,
    ConverUrlPipe,
    ShareScheduleAppointmentsComponent,
    ShareCancelledComponent,
    SharedNotificationComponent,
    NotificationFacilityComponent,
    DoctorsListingComponent,
    NpiModalComponent,
    SharedListDoctorsComponent,
    ViewReferComponent,
    ReReferFormComponent,
    AddReferFormComponent,
    DortorViewComponent,
    UpcommingComponent,
    PreviousComponent,
    CancelledComponent,
    MyScheduledViewReferComponent,
    MyScheduledReReferComponent,
    AddOrExistingDoctorModalComponent,
    AddDoctorResetPasswordModalComponent,
    SortByTimePipe,
    FacilityNavComponent,
    FacilityComponent,
    FacilityFooterComponent,
    FacAboutUsComponent,
    FacContactUsComponent,
    FacPrivacyPolicyComponent,
    FacFaqComponent,
    FacTermsComponent,
    FacPrivacyDoctorComponent,
    FacJoinsComponent,
    AlertModalComponent,
    CmsPipe
  ],
  imports: [
    CommonModule,
    FacilityRoutingModule,
    CarouselModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    OwlDateTimeModule,
    InfiniteScrollModule,
    LazyLoadImageModule,
    NgcCookieConsentModule,
    NgxCaptchaModule,
    OwlNativeDateTimeModule,
    ShareIconsModule,
    ShareButtonsPopupModule,
    GooglePlaceModule,
  ],
  providers: [FacilityService, Store, StoreGuard, ReReferStoreGuard],
})
export class FacilityModule {
  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(faTimesCircle, faShare);
  }
 }
