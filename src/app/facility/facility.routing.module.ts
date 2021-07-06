import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacilityGuard } from '../facility.guard';
import { EditReferGuard } from './edit-refer.guard';
import { FacilityComponent } from './facility/facility.component';
import { ReReferStoreGuard } from './re-refer-store.guard';
import { StoreGuard } from './store.guard';

const routes: Routes = [
    {
        path: '', component: FacilityComponent,
        children: [
            { path: '', redirectTo: 'facility-dashboard', pathMatch: 'full' },
            {
                path: 'facility-dashboard',
                children: [
                    { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
                    {
                        path: 'view-refer',
                        loadChildren: () => import('./view-refer/view-refer.module').then(m => m.ViewReferModule),
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        loadChildren: () => import('./re-refer/re-refer.module').then(m => m.ReReferModule),
                        canActivate: [ReReferStoreGuard],
                    }
                ],
                data: {
                    seo: {
                        title: 'Dashboard | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-doctors-list',
                children: [
                    { path: '', loadChildren: () => import('./doctor-list/doctor-list.module').then(m => m.DoctorListModule) },
                    {
                        path: 'view-refer',
                        loadChildren: () => import('./view-refer/view-refer.module').then(m => m.ViewReferModule),
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        loadChildren: () => import('./re-refer/re-refer.module').then(m => m.ReReferModule),
                        canActivate: [ReReferStoreGuard],
                    },
                ],
                data: {
                    seo: {
                        title: 'Doctors-List | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-my-schedule',
                loadChildren: () => import('./my-schedule/my-schedule.module').then(m => m.MyScheduleModule),
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-notifications',
                children: [
                    { path: '', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule) },
                    {
                        path: 'view-refer',
                        loadChildren: () => import('./view-refer/view-refer.module').then(m => m.ViewReferModule),
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        loadChildren: () => import('./re-refer/re-refer.module').then(m => m.ReReferModule),
                        canActivate: [ReReferStoreGuard],
                    },
                ],
                data: {
                    seo: {
                        title: 'Notification | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-referral-received',
                children: [
                    { path: '', loadChildren: () => import('./refferal-received/refferal-received.module').then(m => m.RefferalReceivedModule) },
                    {
                        path: 'view-refer',
                        loadChildren: () => import('./view-refer/view-refer.module').then(m => m.ViewReferModule),
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        loadChildren: () => import('./re-refer/re-refer.module').then(m => m.ReReferModule),
                        canActivate: [ReReferStoreGuard],
                    }
                ],
                data: {
                    seo: {
                        title: 'Referrals-Received | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-referral-sent',
                children: [
                    { path: '', loadChildren: () => import('./refferal-sent/refferal-sent.module').then(m => m.RefferalSentModule)},
                    {
                        path: 'view-refer',
                        loadChildren: () => import('./view-refer/view-refer.module').then(m => m.ViewReferModule),
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        loadChildren: () => import('./re-refer/re-refer.module').then(m => m.ReReferModule),
                        canActivate: [ReReferStoreGuard],
                    },
                    {
                        path: 'edit-refer-case',
                        loadChildren: () => import('./refferal-sent/edit-referral/edit-referral.module').then(m => m.EditReferralModule),
                        canActivate: [EditReferGuard],
                    }
                ],
                data: {
                    seo: {
                        title: 'Referrals-Sent | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-add-refer-case',
                children: [
                    { path: '', loadChildren: () => import('./add-refer/add-refer.module').then(m => m.AddReferModule) },
                    {
                        path: 'view-refer',
                        loadChildren: () => import('./view-refer/view-refer.module').then(m => m.ViewReferModule),
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        loadChildren: () => import('./re-refer/re-refer.module').then(m => m.ReReferModule),
                        canActivate: [ReReferStoreGuard],
                    },
                ],
                data: {
                    seo: {
                        title: 'Add-Refer-Case | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-change-password', loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule),
                canActivate: [FacilityGuard], data: {
                    seo: {
                        title: 'Change-Password | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                }
            },
            {
                path: 'facility-notification-settings', loadChildren: () => import('./notification-settings/notification-settings.module').then(m => m.NotificationSettingsModule),
                canActivate: [FacilityGuard], data: {
                    seo: {
                        title: 'Notification-Settings | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                }
            },
            {
                path: 'facility-my-profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), data: {
                    seo: {
                        title: 'Profile | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
            },
            {
                path: 'about-us', loadChildren: () => import('./cms-pages/about/about.module').then(m => m.AboutModule), canActivate: [FacilityGuard], data: {
                    seo: {
                        title: 'About-Us | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
            },
            {
                path: 'contact-us', loadChildren: () => import('./cms-pages/contact-us/contact-us.module').then(m => m.ContactUsModule), canActivate: [FacilityGuard], data: {
                    seo: {
                        title: 'Contact-Us | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
            },
            {
                path: 'terms-and-conditions', loadChildren: () => import('./cms-pages/terms/terms.module').then(m => m.TermsModule), canActivate: [FacilityGuard], data: {
                    seo: {
                        title: 'Terms-And-Conditions | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
            },
            {
                path: 'privacy-policy', loadChildren: () => import('./cms-pages/privacy/privacy.module').then(m => m.PrivacyModule), canActivate: [FacilityGuard], data: {
                    seo: {
                        title: 'Privacy-Policy | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
            },
            {
                path: 'doctors-privacy-policy', loadChildren: () => import('./cms-pages/privacy-doctor/privacy-doctor.module').then(m => m.PrivacyDoctorModule), canActivate: [FacilityGuard], data: {
                    seo: {
                        title: 'Doctors-Privacy-Policy | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
            },
            {
                path: 'join-docs-time', loadChildren: () => import('./cms-pages/join/join.module').then(m => m.JoinModule), canActivate: [FacilityGuard], data: {
                    seo: {
                        title: 'Join-DocsTime | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
            },
            {
                path: 'faq', loadChildren: () => import('./cms-pages/faqs/faqs.module').then(m => m.FaqsModule), canActivate: [FacilityGuard], data: {
                    seo: {
                        title: 'FAQs | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                },
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FacilityRoutingModule { }
