import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedDateTimeFacilityModule } from 'src/app/shared-date-time-facility/shared-date-time-facility.module';
import { EditReferralComponent } from './edit-referral/edit-referral.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaskModule } from 'ngx-mask';
import { AlertModalComponent } from './edit-referral/alert-modal/alert-modal.component';

@NgModule({
  declarations: [EditReferralComponent, AlertModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgSelectModule,
    SharedDateTimeFacilityModule,
    LazyLoadImageModule,
    OwlDateTimeModule,
    NgxSpinnerModule,
    OwlNativeDateTimeModule,
    NgxSkeletonLoaderModule,
    RouterModule.forChild([
      {
        path: '', component: EditReferralComponent
      },
    ]),
  ]
})
export class EditReferralModule { }
