import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedDateTimeFacilityModule } from 'src/app/shared-date-time-facility/shared-date-time-facility.module';
import { FacilityReferralSentComponent } from './facility-referral-sent/facility-referral-sent.component';
import { ShareReferralSentComponent } from './share-referral-sent/share-referral-sent.component';

@NgModule({
  declarations: [FacilityReferralSentComponent, ShareReferralSentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedDateTimeFacilityModule,
    LazyLoadImageModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule,
    RouterModule.forChild([
      {
        path: '', component: FacilityReferralSentComponent
      },
    ]),
  ]
})
export class RefferalSentModule { }
