import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacAboutUsComponent } from './fac-about-us/fac-about-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CmsPipe } from './cms.pipe';

@NgModule({
  declarations: [
    FacAboutUsComponent,
    CmsPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    RouterModule.forChild([
      {
        path: '', component: FacAboutUsComponent
      },
    ]),
  ]
})
export class AboutModule { }
