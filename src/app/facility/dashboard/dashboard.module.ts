import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityDashboardComponent } from './facility-dashboard/facility-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedNewAppointmentComponent } from './shared-new-appointment/shared-new-appointment.component';
import { SharedTodayAppointmentComponent } from './shared-today-appointment/shared-today-appointment.component';
import { SharedDateTimeFacilityModule } from 'src/app/shared-date-time-facility/shared-date-time-facility.module';
import { SortByTimePipe } from './sort-by-time.pipe';

@NgModule({
  declarations: [
    FacilityDashboardComponent,
    SharedTodayAppointmentComponent,
    SharedNewAppointmentComponent,
    SortByTimePipe
  ],
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
        path: '', component: FacilityDashboardComponent
      },
    ]),
  ]
})
export class DashboardModule { }
