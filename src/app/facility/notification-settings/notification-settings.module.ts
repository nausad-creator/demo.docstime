import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityNotificationSettingComponent } from './facility-notification-setting/facility-notification-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [FacilityNotificationSettingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      {
        path: '', component: FacilityNotificationSettingComponent
      },
    ]),
  ]
})
export class NotificationSettingsModule { }
