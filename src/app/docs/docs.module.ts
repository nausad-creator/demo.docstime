import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsDashboardComponent } from './docs-dashboard/docs-dashboard.component';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';
import { ReferralsReceivedComponent } from './referrals-received/referrals-received.component';
import { ReferralsSentComponent } from './referrals-sent/referrals-sent.component';
import { ConfirmReceivedModalComponent } from './confirm-received-modal/confirm-received-modal.component';
import { RejectReceivedModalComponent } from './reject-received-modal/reject-received-modal.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShareDatetimepickerComponent } from './share-datetimepicker/share-datetimepicker.component';
import { ShareNewAppointmentsComponent } from './share-new-appointments/share-new-appointments.component';
import { ShareScheduledAppointmentsComponent } from './share-scheduled-appointments/share-scheduled-appointments.component';
import { ShareReferralReceivedComponent } from './share-referral-received/share-referral-received.component';
import { ShareReferralSentComponent } from './share-referral-sent/share-referral-sent.component';
import { PreviousAppointmentsComponent } from './previous-appointments/previous-appointments.component';
import { SharedTodayAppointmentsComponent } from './shared-today-appointments/shared-today-appointments.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SharedOndatetimeScheduledComponent } from './shared-ondatetime-scheduled/shared-ondatetime-scheduled.component';
import { ConvertToPdfPipe } from './convert-to-pdf.pipe';
import { DocsService } from './docs.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotificationComponent } from './notification/notification.component';
import { SharedNotificationComponent } from './shared-notification/shared-notification.component';
import { DoctorViewReferComponent } from './doctor-view-refer/doctor-view-refer.component';
import { DoctorReReferComponent } from './doctor-re-refer/doctor-re-refer.component';
import { DoctorAddReferComponent } from './doctor-add-refer/doctor-add-refer.component';
import { DocsViewMyScheduleComponent } from './docs-view-my-schedule/docs-view-my-schedule.component';
import { DocsReReferMyScheduleComponent } from './docs-re-refer-my-schedule/docs-re-refer-my-schedule.component';
import { DocsUpcommingComponent } from './docs-upcomming/docs-upcomming.component';
import { DocsPreviousComponent } from './docs-previous/docs-previous.component';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';
import { SortByTimePipe } from './sort-by-time.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DocsRouterOutletComponent } from './docs-router-outlet/docs-router-outlet.component';
import { DocNavComponent } from './doc-nav/doc-nav.component';
import { DocFooterComponent } from './doc-footer/doc-footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DocAboutUsComponent } from './doc-about-us/doc-about-us.component';
import { DocContactUsComponent } from './doc-contact-us/doc-contact-us.component';
import { DocPrivacyPolicyComponent } from './doc-privacy-policy/doc-privacy-policy.component';
import { DocJoinsComponent } from './doc-joins/doc-joins.component';
import { DocTermsComponent } from './doc-terms/doc-terms.component';
import { DocPrivacyDoctorComponent } from './doc-privacy-doctor/doc-privacy-doctor.component';
import { DocFaqComponent } from './doc-faq/doc-faq.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimesCircle, faShare, faShieldVirus } from '@fortawesome/free-solid-svg-icons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsPopupModule } from 'ngx-sharebuttons/popup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DocStore } from './doc-store.service';
import { DocRereferGuard } from './doc-rerefer.guard';
import { DocViewGuard } from './doc-view.guard';
import { DoctorRoutingModule } from './doctor.routing.module';
import { CmsPipe } from './cms.pipe';
import { SharedFilterComponent } from './shared-filter/shared-filter.component';
import { TimelineComponent } from './timeline/timeline.component';
import { VerificationComponent } from './my-profile/verification/verification.component';
import { DeleteConfirmationComponent } from './doctor-view-refer/delete-confirmation/delete-confirmation.component';
import { EditReferralComponent } from './referrals-sent/edit-referral/edit-referral.component';
import { EditReferGuard } from './edit-refer.guard';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RejectReReferComponent } from './reject-received-modal/reject-re-refer/reject-re-refer.component';
import { RejectReferGuard } from './reject-rerefer.guard';
@NgModule({
  declarations:
    [
      DocsDashboardComponent,
      MyScheduleComponent,
      ReferralsReceivedComponent,
      ReferralsSentComponent,
      ConfirmReceivedModalComponent,
      RejectReceivedModalComponent,
      MyProfileComponent,
      NotificationSettingsComponent,
      ChangePasswordComponent,
      ShareDatetimepickerComponent,
      ShareNewAppointmentsComponent,
      ShareScheduledAppointmentsComponent,
      ShareReferralReceivedComponent,
      ShareReferralSentComponent,
      PreviousAppointmentsComponent,
      SharedTodayAppointmentsComponent,
      SharedOndatetimeScheduledComponent,
      ConvertToPdfPipe,
      NotificationComponent,
      SharedNotificationComponent,
      DoctorViewReferComponent,
      DoctorReReferComponent,
      DoctorAddReferComponent,
      DocsViewMyScheduleComponent,
      DocsReReferMyScheduleComponent,
      DocsUpcommingComponent,
      DocsPreviousComponent,
      SortByTimePipe,
      DocsRouterOutletComponent,
      DocNavComponent,
      DocFooterComponent,
      DocAboutUsComponent,
      DocContactUsComponent,
      DocPrivacyPolicyComponent,
      DocJoinsComponent,
      DocTermsComponent,
      DocPrivacyDoctorComponent,
      DocFaqComponent,
      AlertModalComponent,
      CmsPipe,
      SharedFilterComponent,
      TimelineComponent,
      VerificationComponent,
      DeleteConfirmationComponent,
      EditReferralComponent,
      RejectReReferComponent
    ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    CarouselModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    OwlDateTimeModule,
    NgcCookieConsentModule,
    InfiniteScrollModule,
    LazyLoadImageModule,
    NgxCaptchaModule,
    OwlNativeDateTimeModule,
    ShareIconsModule,
    ShareButtonsPopupModule,
    FontAwesomeModule,
    GooglePlaceModule,
    NgxSkeletonLoaderModule
  ],
  providers: [DocsService, DocStore, DocViewGuard, DocRereferGuard, EditReferGuard, RejectReferGuard],
})
export class DocsModule {
  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(faTimesCircle, faShare, faShieldVirus);
  }
 }
