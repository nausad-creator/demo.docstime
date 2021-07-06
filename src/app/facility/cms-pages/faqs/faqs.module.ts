import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacFaqComponent } from './fac-faq/fac-faq.component';
import { RouterModule } from '@angular/router';
import { CmsPipe } from './cms.pipe';

@NgModule({
  declarations: [
    FacFaqComponent,
    CmsPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: FacFaqComponent
      },
    ]),
  ]
})
export class FaqsModule { }
