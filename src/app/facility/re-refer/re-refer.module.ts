import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReReferFormComponent } from './re-refer-form/re-refer-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedDateTimeFacilityModule } from 'src/app/shared-date-time-facility/shared-date-time-facility.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaskModule } from 'ngx-mask';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@NgModule({
  declarations: [ReReferFormComponent, AlertModalComponent],
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
        path: '', component: ReReferFormComponent
      },
    ]),
  ]
})
export class ReReferModule { }
