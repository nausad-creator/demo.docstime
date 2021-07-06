import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FacilityMyProfileComponent } from './facility-my-profile/facility-my-profile.component';
import { VerificationComponent } from './facility-my-profile/verification/verification.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [FacilityMyProfileComponent, VerificationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaskModule.forRoot(),
    LazyLoadImageModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule,
    RouterModule.forChild([
      {
        path: '', component: FacilityMyProfileComponent
      },
    ]),
  ]
})
export class ProfileModule { }
