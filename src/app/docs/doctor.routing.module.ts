import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocsGuard } from '../docs.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DocAboutUsComponent } from './doc-about-us/doc-about-us.component';
import { DocContactUsComponent } from './doc-contact-us/doc-contact-us.component';
import { DocFaqComponent } from './doc-faq/doc-faq.component';
import { DocJoinsComponent } from './doc-joins/doc-joins.component';
import { DocPrivacyDoctorComponent } from './doc-privacy-doctor/doc-privacy-doctor.component';
import { DocPrivacyPolicyComponent } from './doc-privacy-policy/doc-privacy-policy.component';
import { DocRereferGuard } from './doc-rerefer.guard';
import { DocTermsComponent } from './doc-terms/doc-terms.component';
import { DocViewGuard } from './doc-view.guard';
import { DocsDashboardComponent } from './docs-dashboard/docs-dashboard.component';
import { DocsPreviousComponent } from './docs-previous/docs-previous.component';
import { DocsReReferMyScheduleComponent } from './docs-re-refer-my-schedule/docs-re-refer-my-schedule.component';
import { DocsRouterOutletComponent } from './docs-router-outlet/docs-router-outlet.component';
import { DocsUpcommingComponent } from './docs-upcomming/docs-upcomming.component';
import { DocsViewMyScheduleComponent } from './docs-view-my-schedule/docs-view-my-schedule.component';
import { DoctorAddReferComponent } from './doctor-add-refer/doctor-add-refer.component';
import { DoctorReReferComponent } from './doctor-re-refer/doctor-re-refer.component';
import { DoctorViewReferComponent } from './doctor-view-refer/doctor-view-refer.component';
import { EditReferGuard } from './edit-refer.guard';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { NotificationComponent } from './notification/notification.component';
import { ReferralsReceivedComponent } from './referrals-received/referrals-received.component';
import { EditReferralComponent } from './referrals-sent/edit-referral/edit-referral.component';
import { ReferralsSentComponent } from './referrals-sent/referrals-sent.component';
import { RejectReReferComponent } from './reject-received-modal/reject-re-refer/reject-re-refer.component';
import { RejectReferGuard } from './reject-rerefer.guard';

const routes: Routes = [
    {
        path: '', component: DocsRouterOutletComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                children: [
                    { path: '', component: DocsDashboardComponent },
                    {
                        path: 'view-refer',
                        component: DoctorViewReferComponent,
                        canActivate: [DocViewGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: DoctorReReferComponent,
                        canActivate: [DocRereferGuard],
                    },
                    {
                        path: 'reject-re-refer-case',
                        component: RejectReReferComponent,
                        canActivate: [RejectReferGuard],
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
                canActivate: [DocsGuard]
            },
            {
                path: 'referrals-received',
                children: [
                    { path: '', component: ReferralsReceivedComponent },
                    {
                        path: 'view-refer',
                        component: DoctorViewReferComponent,
                        canActivate: [DocViewGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: DoctorReReferComponent,
                        canActivate: [DocRereferGuard],
                    },
                    {
                        path: 'reject-re-refer-case',
                        component: RejectReReferComponent,
                        canActivate: [RejectReferGuard],
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
                canActivate: [DocsGuard]
            },
            {
                path: 'notifications',
                children: [
                    { path: '', component: NotificationComponent },
                    {
                        path: 'view-refer',
                        component: DoctorViewReferComponent,
                        canActivate: [DocViewGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: DoctorReReferComponent,
                        canActivate: [DocRereferGuard],
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
                canActivate: [DocsGuard]
            },
            {
                path: 'my-schedule',
                component: MyScheduleComponent,
                children: [
                    { path: '', redirectTo: 'docs-upcomming', pathMatch: 'full' },
                    {
                        path: 'docs-upcomming',
                        component: DocsUpcommingComponent,
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
                        canActivate: [DocsGuard],
                    },
                    {
                        path: 'docs-previous',
                        component: DocsPreviousComponent,
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
                        canActivate: [DocsGuard],
                    }
                ],
                canActivate: [DocsGuard]
            },
            {
                path: 'referrals-sent',
                children: [
                    { path: '', component: ReferralsSentComponent },
                    {
                        path: 'view-refer',
                        component: DoctorViewReferComponent,
                        canActivate: [DocViewGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: DoctorReReferComponent,
                        canActivate: [DocRereferGuard],
                    },
                    {
                        path: 'edit-refer-case',
                        component: EditReferralComponent,
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
                canActivate: [DocsGuard]
            },
            {
                path: 'add-refer-case',
                children: [
                    { path: '', component: DoctorAddReferComponent },
                    {
                        path: 'view-refer',
                        component: DoctorViewReferComponent,
                        canActivate: [DocViewGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: DoctorReReferComponent,
                        canActivate: [DocRereferGuard],
                    }
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
                canActivate: [DocsGuard]
            },
            {
                path: 'doc-my-schedule-view-refer',
                component: DocsViewMyScheduleComponent,
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
                canActivate: [DocViewGuard],
            },
            {
                path: 'doc-my-schedule-re-refer-case',
                component: DocsReReferMyScheduleComponent,
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
                canActivate: [DocRereferGuard],
            },
            {
                path: 'my-profile', component: MyProfileComponent, canActivate: [DocsGuard], data: {
                    seo: {
                        title: 'Profile | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                }
            },
            {
                path: 'change-password', component: ChangePasswordComponent, canActivate: [DocsGuard], data: {
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
                path: 'notification-settings', component: NotificationSettingsComponent, canActivate: [DocsGuard], data: {
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
                path: 'about-us', component: DocAboutUsComponent, canActivate: [DocsGuard], data: {
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
                path: 'contact-us', component: DocContactUsComponent, canActivate: [DocsGuard], data: {
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
                path: 'terms-and-conditions', component: DocTermsComponent, canActivate: [DocsGuard], data: {
                    seo: {
                        title: 'Terms-And-Conditions | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                }
            },
            {
                path: 'privacy-policy', component: DocPrivacyPolicyComponent, canActivate: [DocsGuard], data: {
                    seo: {
                        title: 'Privacy-Policy | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                }
            },
            {
                path: 'doctors-privacy-policy', component: DocPrivacyDoctorComponent, canActivate: [DocsGuard], data: {
                    seo: {
                        title: 'Doctors-Privacy-Policy | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                }
            },
            {
                path: 'join-docs-time', component: DocJoinsComponent, canActivate: [DocsGuard], data: {
                    seo: {
                        title: 'Join-DocsTime | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                }
            },
            {
                path: 'faq', component: DocFaqComponent, canActivate: [DocsGuard], data: {
                    seo: {
                        title: 'FAQs | DocsTime',
                        metaTags: [
                            { name: 'keywords', content: 'online doctor appointment in USA, doctor appointment booking system USA, online doctor appointment system USA, online doctor appointment system website USA, family physicians appointment booking system, online medical appointment booking system USA, doctors accepting new patients in USA, top primary care physicians appointment booking, child specialist doctor online appointment US, free online doctor consultation appointment USA' },
                            { name: 'description', content: 'DocsTime specializes in developing Online Doctor Appointment System in USA. Our highly experienced team of Doctor understands your requirements well, contact us today.' },
                            { name: 'robots', content: 'index, follow' }
                        ]
                    }
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DoctorRoutingModule { }
