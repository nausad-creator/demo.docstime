import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacPrivacyPolicyComponent } from './fac-privacy-policy/fac-privacy-policy.component';
import { RouterModule } from '@angular/router';
import { CmsPipe } from './cms.pipe';

@NgModule({
  declarations: [
    FacPrivacyPolicyComponent,
    CmsPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: FacPrivacyPolicyComponent
      },
    ]),
  ]
})
export class PrivacyModule { }
