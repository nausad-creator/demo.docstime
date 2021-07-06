import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityChangePasswordComponent } from './facility-change-password/facility-change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    FacilityChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      {
        path: '', component: FacilityChangePasswordComponent
      },
    ]),
  ]
})
export class ChangePasswordModule { }
