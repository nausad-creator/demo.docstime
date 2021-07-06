import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedDateTimeFacilityModule } from 'src/app/shared-date-time-facility/shared-date-time-facility.module';
import { FacilityMyScheduleComponent } from './facility-my-schedule/facility-my-schedule.component';
import { FacilityGuard } from 'src/app/facility.guard';
import { CancelledComponent } from './cancelled/cancelled.component';
import { PreviousComponent } from './previous/previous.component';
import { UpcommingComponent } from './upcomming/upcomming.component';
import { ShareScheduleAppointmentsComponent } from './share-schedule-appointments/share-schedule-appointments.component';
import { ShareCancelledComponent } from './share-cancelled/share-cancelled.component';
import { PreviousAppointmentComponent } from './previous-appointment/previous-appointment.component';

@NgModule({
  declarations: [
    FacilityMyScheduleComponent,
    UpcommingComponent,
    PreviousComponent,
    CancelledComponent,
    ShareScheduleAppointmentsComponent,
    ShareCancelledComponent,
    PreviousAppointmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedDateTimeFacilityModule,
    LazyLoadImageModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule,
    RouterModule.forChild([
      {
        path: '',
        component: FacilityMyScheduleComponent,
        children: [
          { path: '', redirectTo: 'upcomming', pathMatch: 'full' },
          {
            path: 'upcomming',
            component: UpcommingComponent,
            data: {
              seo: {
                title: 'My-Schedule-Upcomming | DocsTime',
                metaTags: [
                  { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                  { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                  { name: 'robots', content: 'index, follow' }
                ]
              }
            },
            canActivate: [FacilityGuard],
          },
          {
            path: 'previous',
            component: PreviousComponent,
            data: {
              seo: {
                title: 'My-Schedule-Previous | DocsTime',
                metaTags: [
                  { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                  { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                  { name: 'robots', content: 'index, follow' }
                ]
              }
            },
            canActivate: [FacilityGuard],
          },
          {
            path: 'cancelled',
            component: CancelledComponent,
            data: {
              seo: {
                title: 'My-Schedule-Cancelled | DocsTime',
                metaTags: [
                  { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                  { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                  { name: 'robots', content: 'index, follow' }
                ]
              }
            },
            canActivate: [FacilityGuard],
          }
        ],
        canActivate: [FacilityGuard]
      },
      {
        path: 're-refer-case',
        loadChildren: () => import('./re-refer/re-refer.module').then((m) => m.ReReferModule),
        canActivate: [FacilityGuard],
        data: {
          seo: {
              title: 'My-Schedule-Re-Refer | DocsTime',
              metaTags: [
                  { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                  { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                  { name: 'robots', content: 'index, follow' }
              ]
          }
      },
      },
      {
        path: 'view-refer',
        loadChildren: () => import('./view-schedule/view-schedule.module').then((m) => m.ViewScheduleModule),
        canActivate: [FacilityGuard],
        data: {
          seo: {
              title: 'My-Schedule-View | DocsTime',
              metaTags: [
                  { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                  { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                  { name: 'robots', content: 'index, follow' }
              ]
          }
      },
      },
    ]),
  ]
})
export class MyScheduleModule { }
