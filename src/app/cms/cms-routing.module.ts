import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutContentComponent } from './about-content/about-content.component';
import { ContactDocstimeComponent } from './contact-docstime/contact-docstime.component';
import { ContentComponent } from './content/content.component';
import { FaqContentComponent } from './faq-content/faq-content.component';
import { JoinDocsComponent } from './join-docs/join-docs.component';
import { PolicyDoctorComponent } from './policy-doctor/policy-doctor.component';
import { PolicyComponent } from './policy/policy.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  {
    path: '', component: ContentComponent,
    children: [
      {
        path: 'about-us', component: AboutContentComponent, data: {
          seo: {
            title: 'About-Us | DocsTime',
            metaTags: [
              { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
              { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
              { name: 'robots', content: 'index, follow' }
            ]
          }
        }
      },
      {
        path: 'faq', component: FaqContentComponent, data: {
          seo: {
            title: 'FAQs | DocsTime',
            metaTags: [
              { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
              { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
              { name: 'robots', content: 'index, follow' }
            ]
          }
        }
      },
      {
        path: 'join-docs-time', component: JoinDocsComponent, data: {
          seo: {
            title: 'Join DocsTime | DocsTime',
            metaTags: [
              { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
              { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
              { name: 'robots', content: 'index, follow' }
            ]
          }
        }
      },
      {
        path: 'contact-us', component: ContactDocstimeComponent, data: {
          seo: {
            title: 'Contact-Us | DocsTime',
            metaTags: [
              { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
              { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
              { name: 'robots', content: 'index, follow' }
            ]
          }
        }
      },
      {
        path: 'terms-and-conditions', component: TermsComponent, data: {
          seo: {
            title: 'Terms & Conditions | DocsTime',
            metaTags: [
              { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
              { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
              { name: 'robots', content: 'index, follow' }
            ]
          }
        }
      },
      {
        path: 'privacy-policy', component: PolicyComponent, data: {
          seo: {
            title: 'Privacy Policy | DocsTime',
            metaTags: [
              { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
              { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
              { name: 'robots', content: 'index, follow' }
            ]
          }
        }
      },
      {
        path: 'doctors-privacy-policy', component: PolicyDoctorComponent, data: {
          seo: {
            title: 'Doctor Privacy Policy | DocsTime',
            metaTags: [
              { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
              { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
              { name: 'robots', content: 'index, follow' }
            ]
          }
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
