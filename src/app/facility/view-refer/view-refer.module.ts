import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewReferComponent } from './view-refer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedDateTimeFacilityModule } from 'src/app/shared-date-time-facility/shared-date-time-facility.module';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TruncatePipe } from './truncate.pipe';
import { ConverUrlPipe } from './conver-url.pipe';

@NgModule({
  declarations: [ViewReferComponent, DeleteConfirmationComponent, TruncatePipe, ConverUrlPipe],
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
        path: '', component: ViewReferComponent
      },
    ]),
  ]
})
export class ViewReferModule { }
