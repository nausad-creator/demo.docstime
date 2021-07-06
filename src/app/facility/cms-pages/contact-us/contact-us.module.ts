import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacContactUsComponent } from './fac-contact-us/fac-contact-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CmsPipe } from './cms.pipe';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [
    FacContactUsComponent,
    CmsPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    NgxCaptchaModule,
    RouterModule.forChild([
      {
        path: '', component: FacContactUsComponent
      },
    ]),
  ]
})
export class ContactUsModule { }
