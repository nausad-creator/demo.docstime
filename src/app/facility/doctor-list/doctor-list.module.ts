import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedDateTimeFacilityModule } from 'src/app/shared-date-time-facility/shared-date-time-facility.module';
import { DoctorsListingComponent } from './doctors-listing/doctors-listing.component';
import { SharedListDoctorsComponent } from './shared-list-doctors/shared-list-doctors.component';
import { AddOrExistingDoctorModalComponent } from './add-or-existing-doctor-modal/add-or-existing-doctor-modal.component';
import { AddDoctorResetPasswordModalComponent } from './add-doctor-reset-password-modal/add-doctor-reset-password-modal.component';
import { NpiModalComponent } from './npi-modal/npi-modal.component';
import { DortorViewComponent } from './dortor-view/dortor-view.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    DoctorsListingComponent,
    SharedListDoctorsComponent,
    AddOrExistingDoctorModalComponent,
    AddDoctorResetPasswordModalComponent,
    NpiModalComponent,
    DortorViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    NgSelectModule,
    SharedDateTimeFacilityModule,
    LazyLoadImageModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule,
    RouterModule.forChild([
      {
        path: '', component: DoctorsListingComponent
      },
    ]),
  ]
})
export class DoctorListModule { }
