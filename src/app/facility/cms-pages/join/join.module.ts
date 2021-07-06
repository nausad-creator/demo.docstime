import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacJoinsComponent } from './fac-joins/fac-joins.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CmsPipe } from './cms.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  declarations: [
    FacJoinsComponent,
    CmsPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    LazyLoadImageModule,
    RouterModule.forChild([
      {
        path: '', component: FacJoinsComponent
      },
    ]),
  ]
})
export class JoinModule { }
