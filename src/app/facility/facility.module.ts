import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FacilityService } from './facility.service';
import { ConfirmedReceivedModalComponent } from './confirmed-received-modal/confirmed-received-modal.component';
import { RejectReceivedModalComponent } from './reject-received-modal/reject-received-modal.component';
import { FacilityNotificationSettingComponent } from './notification-settings/facility-notification-setting/facility-notification-setting.component';
import { FacilityChangePasswordComponent } from './change-password/facility-change-password/facility-change-password.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {NgcCookieConsentModule} from 'ngx-cookieconsent';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FacilityNavComponent } from './facility-nav/facility-nav.component';
import { FacilityComponent } from './facility/facility.component';
import { FacilityFooterComponent } from './facility-footer/facility-footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimesCircle, faShare } from '@fortawesome/free-solid-svg-icons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsPopupModule } from 'ngx-sharebuttons/popup';
import { Store } from './store.service';
import { ReReferStoreGuard } from './re-refer-store.guard';
import { StoreGuard } from './store.guard';
import { FacilityRoutingModule } from './facility.routing.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TimelineComponent } from './timeline/timeline.component';
import { EditReferGuard } from './edit-refer.guard';
import { RejectReferGuard } from './reject-rerefer.guard';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SharedDateTimeFacilityModule } from '../shared-date-time-facility/shared-date-time-facility.module';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
@NgModule({
  declarations: [
    ConfirmedReceivedModalComponent,
    RejectReceivedModalComponent,
    FacilityNavComponent,
    FacilityComponent,
    FacilityFooterComponent,
    TimelineComponent
  ],
  imports: [
    CommonModule,
    FacilityRoutingModule,
    CarouselModule,
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    OwlDateTimeModule,
    SharedDateTimeFacilityModule,
    InfiniteScrollModule,
    LazyLoadImageModule,
    NgcCookieConsentModule,
    OwlNativeDateTimeModule,
    ShareIconsModule,
    ShareButtonsPopupModule,
    NgxSkeletonLoaderModule
  ],
  exports: [],
  providers: [FacilityService, Store, StoreGuard, ReReferStoreGuard, EditReferGuard, RejectReferGuard],
})
export class FacilityModule {
  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(faTimesCircle, faShare);
  }
 }
