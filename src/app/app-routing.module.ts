import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { BenefitComponent } from './benefit/benefit.component';
import { ErrorNotFoundComponent } from './error-not-found/error-not-found.component';
import { FeatureComponent } from './feature/feature.component';
import { HomeComponent } from './home/home.component';
import { ListPracticeComponent } from './list-practice/list-practice.component';
import { NotUserGuard } from './not-user.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [NotUserGuard] },
  { path: '*', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home', component: HomeComponent, data: {
      seo: {
        title: 'Online Doctor Appointment System in USA | Child Specialist Doctor, Family Physicians and Primary Care Physicians Appointment Booking System in USA | DocsTime',
        metaTags: [
          { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
          { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
          { name: 'robots', content: 'index, follow' }
        ]
      }
    }
  },
  { path: 'redirectMe', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'list-practice', component: ListPracticeComponent, data: {
      seo: {
        title: 'List-Practice | DocsTime',
        metaTags: [
          { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
          { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
          { name: 'robots', content: 'index, follow' }
        ]
      }
    }
  },
  {
    path: 'benefits', component: BenefitComponent, data: {
      seo: {
        title: 'Benefits | DocsTime',
        metaTags: [
          { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
          { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
          { name: 'robots', content: 'index, follow' }
        ]
      }
    }
  },
  {
    path: 'features', component: FeatureComponent, data: {
      seo: {
        title: 'Features | DocsTime',
        metaTags: [
          { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
          { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
          { name: 'robots', content: 'index, follow' }
        ]
      }
    }
  },
  {
    path: 'content', loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule)
  },
  {
    path: 'facility', loadChildren: () => import('./facility/facility.module').then(m => m.FacilityModule)
  },
  {
    path: 'doctor', loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
  },
  {
    path: '404', component: ErrorNotFoundComponent, data: {
      seo: {
        title: 'Error-Not-Found | DocsTime',
        metaTags: [
          { name: 'keywords', content: 'Error not found' },
          { name: 'description', content: 'The page you are looking is currently not present or removed.' },
          { name: 'robots', content: 'index, follow' }
        ]
      }
    }
  },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'legacy',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
