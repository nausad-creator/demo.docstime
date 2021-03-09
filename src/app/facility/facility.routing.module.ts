import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacilityGuard } from '../facility.guard';
import { AddReferFormComponent } from './add-refer-form/add-refer-form.component';
import { CancelledComponent } from './cancelled/cancelled.component';
import { DoctorsListingComponent } from './doctors-listing/doctors-listing.component';
import { EditReferGuard } from './edit-refer.guard';
import { FacAboutUsComponent } from './fac-about-us/fac-about-us.component';
import { FacContactUsComponent } from './fac-contact-us/fac-contact-us.component';
import { FacFaqComponent } from './fac-faq/fac-faq.component';
import { FacJoinsComponent } from './fac-joins/fac-joins.component';
import { FacPrivacyDoctorComponent } from './fac-privacy-doctor/fac-privacy-doctor.component';
import { FacPrivacyPolicyComponent } from './fac-privacy-policy/fac-privacy-policy.component';
import { FacTermsComponent } from './fac-terms/fac-terms.component';
import { FacilityChangePasswordComponent } from './facility-change-password/facility-change-password.component';
import { FacilityDashboardComponent } from './facility-dashboard/facility-dashboard.component';
import { FacilityMyProfileComponent } from './facility-my-profile/facility-my-profile.component';
import { FacilityMyScheduleComponent } from './facility-my-schedule/facility-my-schedule.component';
import { FacilityNotificationSettingComponent } from './facility-notification-setting/facility-notification-setting.component';
import { FacilityReferralReceivedComponent } from './facility-referral-received/facility-referral-received.component';
import { EditReferralComponent } from './facility-referral-sent/edit-referral/edit-referral.component';
import { FacilityReferralSentComponent } from './facility-referral-sent/facility-referral-sent.component';
import { FacilityComponent } from './facility/facility.component';
import { MyScheduledReReferComponent } from './my-scheduled-re-refer/my-scheduled-re-refer.component';
import { MyScheduledViewReferComponent } from './my-scheduled-view-refer/my-scheduled-view-refer.component';
import { NotificationFacilityComponent } from './notification-facility/notification-facility.component';
import { PreviousComponent } from './previous/previous.component';
import { ReReferFormComponent } from './re-refer-form/re-refer-form.component';
import { ReReferStoreGuard } from './re-refer-store.guard';
import { RejectReReferComponent } from './reject-received-modal/reject-re-refer/reject-re-refer.component';
import { RejectReferGuard } from './reject-rerefer.guard';
import { StoreGuard } from './store.guard';
import { UpcommingComponent } from './upcomming/upcomming.component';
import { ViewReferComponent } from './view-refer/view-refer.component';

const routes: Routes = [
    {
        path: '', component: FacilityComponent,
        children: [
            { path: '', redirectTo: 'facility-dashboard', pathMatch: 'full' },
            {
                path: 'facility-dashboard',
                children: [
                    { path: '', component: FacilityDashboardComponent },
                    {
                        path: 'view-refer',
                        component: ViewReferComponent,
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: ReReferFormComponent,
                        canActivate: [ReReferStoreGuard],
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
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-doctors-list',
                children: [
                    { path: '', component: DoctorsListingComponent },
                    {
                        path: 'view-refer',
                        component: ViewReferComponent,
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: ReReferFormComponent,
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
                path: 'facility-notifications',
                children: [
                    { path: '', component: NotificationFacilityComponent },
                    {
                        path: 'view-refer',
                        component: ViewReferComponent,
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: ReReferFormComponent,
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
                    { path: '', component: FacilityReferralReceivedComponent },
                    {
                        path: 'view-refer',
                        component: ViewReferComponent,
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: ReReferFormComponent,
                        canActivate: [ReReferStoreGuard],
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
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-referral-sent',
                children: [
                    { path: '', component: FacilityReferralSentComponent },
                    {
                        path: 'view-refer',
                        component: ViewReferComponent,
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: ReReferFormComponent,
                        canActivate: [ReReferStoreGuard],
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
                canActivate: [FacilityGuard]
            },
            {
                path: 'facility-add-refer-case',
                children: [
                    { path: '', component: AddReferFormComponent },
                    {
                        path: 'view-refer',
                        component: ViewReferComponent,
                        canActivate: [StoreGuard],
                    },
                    {
                        path: 're-refer-case',
                        component: ReReferFormComponent,
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
                path: 'my-schedule-view-refer',
                component: MyScheduledViewReferComponent,
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
                canActivate: [StoreGuard],
            },
            {
                path: 'my-schedule-re-refer-case',
                component: MyScheduledReReferComponent,
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
                canActivate: [ReReferStoreGuard],
            },
            {
                path: 'facility-change-password', component: FacilityChangePasswordComponent,
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
                path: 'facility-notification-settings', component: FacilityNotificationSettingComponent,
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
                path: 'facility-my-profile', component: FacilityMyProfileComponent, data: {
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
                path: 'about-us', component: FacAboutUsComponent, canActivate: [FacilityGuard], data: {
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
                path: 'contact-us', component: FacContactUsComponent, canActivate: [FacilityGuard], data: {
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
                path: 'terms-and-conditions', component: FacTermsComponent, canActivate: [FacilityGuard], data: {
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
                path: 'privacy-policy', component: FacPrivacyPolicyComponent, canActivate: [FacilityGuard], data: {
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
                path: 'doctors-privacy-policy', component: FacPrivacyDoctorComponent, canActivate: [FacilityGuard], data: {
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
                path: 'join-docs-time', component: FacJoinsComponent, canActivate: [FacilityGuard], data: {
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
                path: 'faq', component: FacFaqComponent, canActivate: [FacilityGuard], data: {
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
