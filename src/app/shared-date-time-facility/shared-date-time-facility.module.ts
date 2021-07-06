import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareDatetimepickerComponent } from './share-datetimepicker/share-datetimepicker.component';
import { SharedFilterComponent } from './shared-filter/shared-filter.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CmsPipe } from './cms.pipe';
import { SortByTimePipe } from './sort-by-time.pipe';
import { TruncatePipe } from './truncate.pipe';
import { ConverUrlPipe } from './conver-url.pipe';
import { SharedOndatetimeScheduledComponent } from './shared-ondatetime-scheduled/shared-ondatetime-scheduled.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    ShareDatetimepickerComponent,
    SharedFilterComponent,
    SharedOndatetimeScheduledComponent,
    CmsPipe,
    SortByTimePipe,
    TruncatePipe,
    ConverUrlPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    LazyLoadImageModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxSkeletonLoaderModule
  ],
  exports: [
    ShareDatetimepickerComponent,
    SharedOndatetimeScheduledComponent,
    SharedFilterComponent,
    CommonModule, FormsModule
]
})
export class SharedDateTimeFacilityModule { }
