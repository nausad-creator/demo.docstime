import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacPrivacyDoctorComponent } from './fac-privacy-doctor/fac-privacy-doctor.component';
import { RouterModule } from '@angular/router';
import { CmsPipe } from './cms.pipe';

@NgModule({
  declarations: [
    FacPrivacyDoctorComponent,
    CmsPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: FacPrivacyDoctorComponent
      },
    ]),
  ]
})
export class PrivacyDoctorModule { }
