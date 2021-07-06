import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacTermsComponent } from './fac-terms/fac-terms.component';
import { RouterModule } from '@angular/router';
import { CmsPipe } from './cms.pipe';

@NgModule({
  declarations: [
    FacTermsComponent,
    CmsPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: FacTermsComponent
      },
    ]),
  ]
})
export class TermsModule { }
