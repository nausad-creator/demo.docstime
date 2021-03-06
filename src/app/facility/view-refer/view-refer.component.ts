import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmedReceivedModalComponent } from '../confirmed-received-modal/confirmed-received-modal.component';
import { RejectReceivedModalComponent } from '../reject-received-modal/reject-received-modal.component';
import { Router } from '@angular/router';
import { FacilityService } from '../facility.service';
import { Location } from '@angular/common';
import { Store } from '../store.service';
import { ReferCase } from '../docs.interface';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-view-refer',
  template: `<body class="dashbord-section">
  <div class="spacetop"></div>
  <section class="section-dashbord overflow-hidden">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-8 appointment-conten order-2 order-lg-1 pt-3">
          <div class="refrred-cases-content card show-detail wow fadeInRight"
            style="width: 100%; min-height: 100%; position: relative;" data-wow-delay="0.1s" *ngIf="caseViewData">
            <div class="titlecases d-flex">
              <h4 class="mb-0">Referred Cases</h4>
              <p class="ml-auto">
                <a (click)="editCase(caseViewData)" class="referred-btn ml-1 cursr"
                  *ngIf="caseViewData.refercaseStatus === 'Pending' && from === 'sent'">
                  <i class="ti-pencil"></i> Edit</a>
                <a (click)="deleteCase(caseViewData.refercaseID)" class="referred-btn ml-1 cursr"
                  *ngIf="caseViewData.refercaseStatus === 'Pending' && from === 'sent'">
                  <i class="ti-trash"></i> Delete</a>
                <a (click)="onClickBack()" style="cursor: pointer;" class="referred-btn ml-1">
                  <i class="ti-angle-left"></i>
                  Back</a></p>
            </div>
            <hr>
            <div class="">
              <!-- not sent -->
              <div class="content-referral" *ngIf="caseViewData && from !== 'sent'">
                <h5 class="mb-0" *ngIf="caseViewData.refFacilityName">Primary Facility</h5>
                <div class="selected-users d-flex mb-3" *ngIf="caseViewData.refFacilityName">
                  <a style="cursor: pointer;" class="primary-items" style="min-width:250px;">
                    <div class="lefttext">
                      <p class="mb-0">
                        {{caseViewData.refFacilityName | titlecase}}</p>
                    </div>
                  </a>
                </div>
                <div class="row">
                  <div class="listinfor col-sm-6" *ngIf="caseViewData.refDocName || caseViewData.refSpecialityName">
                    <h5 class="mb-0">Referred by</h5>
                    <div class="selected-users d-flex mb-3" *ngIf="caseViewData.refDocName">
                      <a style="cursor: pointer;" class="usersdeta-items" [ngClass]="
                  {
                    'lengMax': caseViewData.refDocName.length > 25,
                    'lengSmall': caseViewData.refDocName.length <= 25
                  }" style="height:auto;">
                        <div class="lefttext collepse_click collapsed" data-toggle="collapse"
                          href="#multiCollapseExample1" role="button" aria-expanded="false"
                          aria-controls="multiCollapseExample1">
                          <h4 class="mb-0"
                            *ngIf="caseViewData.refDocName !== null && caseViewData.refDocName !== undefined">
                            {{preFixDRstr === 'DR.' ? ((caseViewData.refDocName  | truncate ) | titlecase) : (('Dr. ' + caseViewData.refDocName  | truncate ) | titlecase)}}
                          </h4>
                          <p class="mb-0" *ngIf="caseViewData.refSpecialityName">
                            {{caseViewData.refSpecialityName | titlecase}}</p>
                        </div>
                        <div class="collapse multi-collapse" id="multiCollapseExample1">
                          <div class="toggledbody pt-3">
                            <div class="listinfor text-white" (click)="phone(caseViewData.reffacilityMobileNumber)" *ngIf="caseViewData.reffacilityMobileNumber"> <i
                                class="ti-mobile text-white"></i> &nbsp; {{caseViewData.reffacilityMobileNumber}} </div>
                            <div class="listinfor text-white" (click)="mail(caseViewData.reffacilityEmail)" *ngIf="caseViewData.reffacilityEmail"> <i
                                class="ti-email text-white"></i> &nbsp; {{caseViewData.reffacilityEmail}} </div>
                            <div class="listinfor text-white" *ngIf="caseViewData.reffacilityFaxNumber"> <i
                                class="fa fa-fax text-white" aria-hidden="true"></i> &nbsp; {{caseViewData.reffacilityFaxNumber}}
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>

                    <div class="selected-users d-flex mb-3"
                      *ngIf="!caseViewData.refDocName && caseViewData.refSpecialityName">
                      <a style="cursor: pointer;" class="primary-items" style="min-width:250px;">
                        <div class="lefttext">
                          <p class="mb-0">
                            {{caseViewData.refSpecialityName | titlecase}}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div class="listinfor col-sm-6" *ngIf="caseViewData.doctorFullName || caseViewData.specialityName">
                    <h5 class="mb-0">Referred to</h5>
                    <div class="selected-users d-flex mb-3" *ngIf="caseViewData.doctorFullName">
                      <a class="usersdeta-items" [ngClass]="
                      {
                        'lengMax': caseViewData.doctorFullName.length > 25,
                        'lengSmall': caseViewData.doctorFullName.length <= 25
                      }" style="height:auto;">
                        <div class="lefttext">
                          <h4 class="mb-0"
                            *ngIf="caseViewData.doctorFullName !== null && caseViewData.doctorFullName !== undefined">
                            {{preFixDRstrSent === 'DR.' ? ((caseViewData.doctorFullName  | truncate ) | titlecase) : (('Dr. ' + caseViewData.doctorFullName  | truncate ) | titlecase)}}
                          </h4>
                          <p class="mb-0" *ngIf="caseViewData.specialityName">
                            {{caseViewData.specialityName | titlecase}}</p>
                        </div>
                      </a>
                    </div>
                    <div class="selected-users d-flex mb-3"
                      *ngIf="!caseViewData.doctorFullName && caseViewData.specialityName">
                      <a class="primary-items" style="min-width:250px;">
                        <div class="lefttext">
                          <p class="mb-0">
                            {{caseViewData.specialityName | titlecase}}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="listinfor col-sm-6">
                    <h4>Reason for consultation</h4>
                    <p class="text-dark">
                      {{caseViewData.reasonName ? caseViewData.reasonName : caseViewData.reasonNames ? caseViewData.reasonNames : 'N/A'}}
                    </p>
                  </div>
                  <div class="listinfor col-sm-6" *ngIf="refercaseVisitDate">
                    <h4>Appointment Date & Time</h4>
                    <p class="text-dark" *ngIf="refercaseVisitDate">
                      {{(refercaseVisitDate | date : 'mediumDate') + convertedTime}}
                    </p>
                  </div>
                  <div class="listinfor col-sm-10" *ngIf="caseViewData.refercaseDescription">
                    <h4>Descripion</h4>
                    <p class="text-dark" *ngIf="caseViewData.refercaseDescription">
                      {{caseViewData.refercaseDescription}}
                    </p>
                  </div>
                </div>
              </div>
              <!-- sent -->
              <div class="content-referral" *ngIf="caseViewData && from === 'sent'">
                <div class="row">
                  <div class="listinfor col-sm-6" *ngIf="caseViewData.doctorFullName || caseViewData.specialityName">
                    <h5 class="mb-0">Referred to</h5>

                    <div class="selected-users d-flex mb-3" *ngIf="caseViewData.doctorFullName">
                      <a style="cursor: pointer;" class="usersdeta-items" [ngClass]="
                      {
                        'lengMax': caseViewData.doctorFullName.length > 25,
                        'lengSmall': caseViewData.doctorFullName.length <= 25
                      }" style="height:auto;">
                        <div class="lefttext collepse_click collapsed" data-toggle="collapse"
                          href="#multiCollapseExample2" role="button" aria-expanded="false"
                          aria-controls="multiCollapseExample1">
                          <h4 class="mb-0"
                            *ngIf="caseViewData.doctorFullName !== null && caseViewData.doctorFullName !== undefined">
                            {{preFixDRstrSent === 'DR.' ? ((caseViewData.doctorFullName  | truncate ) | titlecase) : (('Dr. ' + caseViewData.doctorFullName  | truncate ) | titlecase)}}
                          </h4>
                          <p class="mb-0" *ngIf="caseViewData.specialityName">
                            {{caseViewData.specialityName | titlecase}}</p>
                        </div>
                        <div class="collapse multi-collapse" id="multiCollapseExample2">
                          <div class="toggledbody pt-3">
                            <div class="listinfor text-white" (click)="phone(caseViewData.primaryfacilityMobileNumber)" *ngIf="caseViewData.primaryfacilityMobileNumber"> <i
                                class="ti-mobile text-white"></i> &nbsp; {{caseViewData.primaryfacilityMobileNumber}} </div>
                            <div class="listinfor text-white" (click)="mail(caseViewData.primaryfacilityEmail)" *ngIf="caseViewData.primaryfacilityEmail"> <i
                                class="ti-email text-white"></i> &nbsp; {{caseViewData.primaryfacilityEmail}} </div>
                            <div class="listinfor text-white" *ngIf="caseViewData.primaryfacilityFaxNumber"> <i
                                class="fa fa-fax text-white" aria-hidden="true"></i> &nbsp; {{caseViewData.primaryfacilityFaxNumber}}
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div class="selected-users d-flex mb-3"
                      *ngIf="!caseViewData.doctorFullName && caseViewData.specialityName">
                      <a style="cursor: pointer;" class="primary-items" style="min-width:250px;">
                        <div class="lefttext">
                          <p class="mb-0">
                            {{caseViewData.specialityName | titlecase}}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div class="listinfor col-sm-6" *ngIf="caseViewData.refDocName || caseViewData.refSpecialityName">
                    <h5 class="mb-0">Referred by</h5>
                    <div class="selected-users d-flex mb-3" *ngIf="caseViewData.refDocName">
                      <a class="usersdeta-items" [ngClass]="
                  {
                    'lengMax': caseViewData.refDocName.length > 25,
                    'lengSmall': caseViewData.refDocName.length <= 25
                  }" style="height:auto;">
                        <div class="lefttext">
                          <h4 class="mb-0"
                            *ngIf="caseViewData.refDocName !== null && caseViewData.refDocName !== undefined">
                            {{preFixDRstr === 'DR.' ? ((caseViewData.refDocName  | truncate ) | titlecase) : (('Dr. ' + caseViewData.refDocName  | truncate ) | titlecase)}}
                          </h4>
                          <p class="mb-0" *ngIf="caseViewData.refSpecialityName">
                            {{caseViewData.refSpecialityName | titlecase}}</p>
                        </div>
                      </a>
                    </div>
                    <div class="selected-users d-flex mb-3"
                      *ngIf="!caseViewData.refDocName && caseViewData.refSpecialityName">
                      <a class="primary-items" style="min-width:250px;">
                        <div class="lefttext">
                          <p class="mb-0">
                            {{caseViewData.refSpecialityName | titlecase}}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="listinfor col-sm-6">
                    <h4>Reason for consultation</h4>
                    <p class="text-dark">
                      {{caseViewData.reasonName ? caseViewData.reasonName : caseViewData.reasonNames ? caseViewData.reasonNames : 'N/A'}}
                    </p>
                  </div>
                  <div class="listinfor col-sm-6" *ngIf="refercaseVisitDate">
                    <h4>Appointment Date & Time</h4>
                    <p class="text-dark" *ngIf="refercaseVisitDate">
                      {{(refercaseVisitDate | date : 'mediumDate') + convertedTime}}
                    </p>
                  </div>
                  <div class="listinfor col-sm-10" *ngIf="caseViewData.refercaseDescription">
                    <h4>Descripion</h4>
                    <p class="text-dark" *ngIf="caseViewData.refercaseDescription">
                      {{caseViewData.refercaseDescription}}
                    </p>
                  </div>
                </div>
              </div>
              <div class="patient-information mt-1">
                <h4 class="mb-3">Patient Information</h4>
                <div class="row">
                  <div class="listinfor col-sm-6" *ngIf="caseViewData.patientFirstName"> <i class="ti-user"></i> &nbsp;
                    {{caseViewData.patientFirstName}}</div>
                  <div class="listinfor col-sm-6" title="mail" style="cursor: pointer;" (click)="mail(caseViewData.patientEmail)" *ngIf="caseViewData.patientEmail"> <i class="ti-email"></i> &nbsp;
                    {{caseViewData.patientEmail}}</div>
                  <div class="listinfor col-sm-6" title="phone" style="cursor: pointer;" (click)="phone(caseViewData.patientMobile)" *ngIf="caseViewData.patientMobile"> <i class="ti-mobile"></i> &nbsp;
                    {{caseViewData.patientMobile}}</div>
                  <div class="listinfor col-sm-6" *ngIf="caseViewData.patientGender"> <i class="ti-target"></i> &nbsp;
                    {{caseViewData.patientGender}}</div>
                  <div class="listinfor col-sm-6" *ngIf="caseViewData.patientDOB"> <i class="ti-calendar"></i> &nbsp;
                    {{caseViewData.patientDOB | date: 'mediumDate'}}</div>
                  <div class="listinfor col-sm-6" *ngIf="caseViewData.insuranceNames"> <i class="ti-shield"></i> &nbsp;
                    {{caseViewData.insuranceNames}}</div>
                  <div class="listinfor col-sm-12" *ngIf="caseViewData.refercaseHospitalAdmission === 'Yes'">
                    <span class="iconify" data-icon="icomoon-free:checkbox-checked" data-inline="false" style="color: blue;width: 1.1em;
                        height: 1.1em;"></span> &nbsp;
                    {{'Hospital/Facility admission required'}}</div>
                  <div class="listinfor sb-text col-sm-12" *ngIf="caseViewData.refercaseUrgent === 'Yes'">&nbsp;
                    {{'Urgent Consult'}}</div>
                </div>
                <div class="row" style="padding-top: 10px;" *ngIf="caseViewData && from === 'sent'">
                  <div class=" col-sm-6 mb-1" *ngIf="caseViewData.refercaseSentDate">Referral Sent: <a
                      style="cursor: default;">{{caseViewData.refercaseSentDate | date : 'MMM d, y, h:mm a'}}</a></div>
                  <div class=" col-sm-6 mb-1"
                    *ngIf="caseViewData.refercaseVisitDate && caseViewData.refercaseVisitTime">
                    Appointment Date:
                    <a style="cursor: default;">{{(caseViewData.refercaseVisitDate + ' ' + caseViewData.refercaseVisitTime) | date : 'MMM d, y, h:mm a'}}
                      <span
                        *ngIf="caseViewData.timeline.length > 0">{{'(' + caseViewData.timeline[0].tzCountryCode + ')'}}</span>
                    </a></div>
                  <div class=" col-sm-6 mb-1"
                    *ngIf="caseViewData.refercaseVisitDate && !caseViewData.refercaseVisitTime">
                    Appointment Date:
                    <a style="cursor: default;">{{caseViewData.refercaseVisitDate | date : 'mediumDate'}}
                      <span
                        *ngIf="caseViewData.timeline.length > 0">{{'(' + caseViewData.timeline[0].tzCountryCode + ')'}}</span>
                    </a></div>
                  <div class=" col-sm-6 mb-1"
                    *ngIf="caseViewData.refercaseConfirmedDate && caseViewData.refercaseConfirmedDate !== '0000-00-00 00:00:00'">
                    Referral Confirmed: <a
                      style="cursor: default;">{{caseViewData.refercaseConfirmedDate | date : 'MMM d, y, h:mm a'}}</a>
                  </div>
                  <div class=" col-sm-6 mb-1"
                    *ngIf="caseViewData.refercaseLastUpdatedDate && caseViewData.refercaseLastUpdatedDate !== '0000-00-00 00:00:00'">
                    Last Updated Date: <a
                      style="cursor: default;">{{caseViewData.refercaseLastUpdatedDate | date : 'MMM d, y, h:mm a'}}</a>
                  </div>
                </div>

                <div class="row" style="padding-top: 10px;" *ngIf="caseViewData && from !== 'sent'">
                  <div class=" col-sm-6 mb-1" *ngIf="caseViewData.refercaseReceivedDate">Referral Received:
                    <a style="cursor: default;">{{caseViewData.refercaseReceivedDate | date : 'MMM d, y, h:mm a'}}</a>
                  </div>
                  <div class=" col-sm-6 mb-1"
                    *ngIf="caseViewData.refercaseVisitDate && caseViewData.refercaseVisitTime">
                    Appointment Date:
                    <a style="cursor: default;">{{(caseViewData.refercaseVisitDate + ' ' + caseViewData.refercaseVisitTime) | date : 'MMM d, y, h:mm a'}}
                      <span
                        *ngIf="caseViewData.timeline.length > 0">{{'(' + caseViewData.timeline[0].tzCountryCode + ')'}}</span>
                    </a></div>
                  <div class=" col-sm-6 mb-1"
                    *ngIf="caseViewData.refercaseVisitDate && !caseViewData.refercaseVisitTime">
                    Appointment Date:
                    <a style="cursor: default;">{{caseViewData.refercaseVisitDate | date : 'mediumDate'}}
                      <span
                        *ngIf="caseViewData.timeline.length > 0">{{'(' + caseViewData.timeline[0].tzCountryCode + ')'}}</span>
                    </a></div>
                  <div class=" col-sm-6 mb-1"
                    *ngIf="caseViewData.refercaseConfirmedDate && caseViewData.refercaseConfirmedDate !== '0000-00-00 00:00:00'">
                    Referral Confirmed:
                    <a style="cursor: default;">{{caseViewData.refercaseConfirmedDate | date : 'MMM d, y, h:mm a'}}</a>
                  </div>
                  <div class=" col-sm-6 mb-1"
                    *ngIf="caseViewData.refercaseLastUpdatedDate && caseViewData.refercaseLastUpdatedDate !== '0000-00-00 00:00:00'">
                    Last Updated Date:
                    <a
                      style="cursor: default;">{{caseViewData.refercaseLastUpdatedDate | date : 'MMM d, y, h:mm a'}}</a>
                  </div>
                </div>
              </div>
              <hr>
              <div class="attached-document">
                <h4 class="mb-3">Attach Documents</h4>
                <div class="row" *ngIf="caseViewData.documents.length > 0">
                  <div class="imageitems col-md-4" *ngFor="let item of caseViewData.documents | converUrl">
                    <h *ngIf="item.ImageData.length > 0">{{item.documenttypeName}}</h>
                    <div *ngIf="item.ImageData.length > 0">
                      <a style="cursor: pointer;" *ngFor="let url of item.ImageData"><img
                          style="width: 171px; height: 163px; margin-bottom: 5px; display: inline; border: 1px solid #ced4da; cursor:pointer; border-radius: .25rem;" defaultImage="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUFBQUFBQYGBgYICQgJCAwLCgoLDBINDg0ODRIbERQRERQRGxgdGBYYHRgrIh4eIisyKigqMjw2NjxMSExkZIYBCgoKCgoKCwwMCw8RDxEPFxUTExUXIhkaGRoZIjQhJiEhJiE0LjguKy44LlNBOjpBU2BRTFFgdGhodJOLk8DA///AABEIAAUABQMBEQACEQEDEQH/xABcAAEAAAAAAAAAAAAAAAAAAAAHEAEAAgEFAAAAAAAAAAAAAAACAQMRAAQFB0EBAQEAAAAAAAAAAAAAAAAAAAMEEQAABQUAAAAAAAAAAAAAAAAAAQIDQRITISKR/9oADAMBAAIRAxEAPwAZjt2+oGm3hNumMwmLmIUx7ic6mtPQ/iNSC1plsuj/2Q==" [lazyLoad]="url"
                          offset="100" [errorImage]="'assets/img/error_not_found.png'" alt="note" title="uploaded file"
                          (click)="openImage(url)"></a>
                    </div>
                  </div>
                </div>
                <div class="" style="margin-top: 40px; height: 180px;" *ngIf="caseViewData.documents.length === 0">
                  <div class="row">
                    <div class="col">
                      <p class="text-center">No Attach Documents Found.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- for inside sent -->
            <div class="btns-" *ngIf="from === 'insideSent'">
              <a style="cursor: pointer;" *ngIf="caseViewData.refercaseStatus === 'Pending'"
                class="btn btn-outline-primary btn-sm" (click)="openModalConfirm(caseViewData)">Confirm/Reschedule</a>
              <a style="cursor: pointer; margin-left: 5px;" *ngIf="caseViewData.refercaseStatus === 'Pending'"
                class="btn btn-outline-primary btn-sm" (click)="openModalReject(caseViewData)">Reject</a>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Accepted'">
                <div class="text-success" style="float: left; margin-top: 10px;"><img src="assets/img/check-icon.svg"
                    alt="" height="15px">Confirmed</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Rejected'">
                <div class="text-danger" style="float: left; margin-top: 10px;"><img src="assets/img/close-icon.svg"
                    alt="" height="15px">Rejected</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Expired'">
                <div class="text-muted" style="float: left; margin-top: 10px;"><i class="ti-na"></i> Expired</div>
              </div>
              <a style="cursor: pointer; float: right;" *ngIf="from === 'insideSent' && caseViewData.refercaseStatus !== 'Pending'"
                (click)="onClickRereferSent(caseViewData)"
                [ngClass]="{'btn-outline-primary btn-sm' : caseViewData.refercaseReRefferred === 'No', 'btn disabled' : caseViewData.refercaseReRefferred === 'Yes'}">Refer Case</a>
            </div>
            <!-- for dashboard and received -->
            <div class="btns-" *ngIf="from === 'dashboard' || from === 'received' || from === 'notifications'">
              <a style="cursor: pointer;" *ngIf="caseViewData.refercaseStatus === 'Pending'"
                class="btn btn-outline-primary btn-sm" (click)="openModalConfirm(caseViewData)">Confirm/Reschedule</a>
              <a style="cursor: pointer; margin-left: 5px;" *ngIf="caseViewData.refercaseStatus === 'Pending'"
                class="btn btn-outline-primary btn-sm" (click)="openModalReject(caseViewData)">Reject</a>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Accepted'">
                <div class="text-success" style="float: left; margin-top: 10px;"><img src="assets/img/check-icon.svg"
                    alt="" height="15px">Confirmed</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Rejected'">
                <div class="text-danger" style="float: left; margin-top: 10px;"><img src="assets/img/close-icon.svg"
                    alt="" height="15px">Rejected</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Expired'">
                <div class="text-muted" style="float: left; margin-top: 10px;"><i class="ti-na"></i> Expired</div>
              </div>
              <a style="cursor: pointer; float: right;" *ngIf="from === 'dashboard' && caseViewData.refercaseStatus !== 'Pending'"
                (click)="onClickRereferDashboard(caseViewData)"
                [ngClass]="{'btn-outline-primary btn-sm' : caseViewData.refercaseReRefferred === 'No', 'btn disabled' : caseViewData.refercaseReRefferred === 'Yes' || caseViewData.refercaseStatus === 'Expired'}">Refer Case</a>
              <a style="cursor: pointer; float: right;" *ngIf="from === 'received' && caseViewData.refercaseStatus !== 'Pending'"
                (click)="onClickRereferReceived(caseViewData)"
                [ngClass]="{'btn-outline-primary btn-sm' : caseViewData.refercaseReRefferred === 'No', 'btn disabled' : caseViewData.refercaseReRefferred === 'Yes' || caseViewData.refercaseStatus === 'Expired'}">Refer Case</a>
              <a style="cursor: pointer; float: right;" *ngIf="from === 'notifications' && caseViewData.refercaseStatus !== 'Pending'"
                (click)="onClickRereferNotification(caseViewData)"
                [ngClass]="{'btn-outline-primary btn-sm' : caseViewData.refercaseReRefferred === 'No', 'btn disabled' : caseViewData.refercaseReRefferred === 'Yes' || caseViewData.refercaseStatus === 'Expired'}">Refer Case</a>
            </div>
            <!-- for sent -->
            <div class="btns-" *ngIf="from === 'sent'">
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Rejected'">
                <div class="text-danger" style="float: left; margin-top: 10px;"><img src="assets/img/close-icon.svg"
                    alt="" height="15px">Rejected</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Accepted'">
                <div class="text-success" style="float: left; margin-top: 10px;"><img src="assets/img/check-icon.svg"
                    alt="" height="15px">Confirmed</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Pending'">
                <div class="text-warning" style="float: left; margin-top: 10px;"><img src="assets/img/warning-icon.svg"
                    alt="" height="15px"> Pending</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Completed'">
                <div class="text-primary" style="float: left; margin-top: 10px;"><img src="assets/img/done.svg" alt=""
                    height="15px">Completed</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Expired'">
                <div class="text-muted" style="float: left; margin-top: 10px;"><i class="ti-na"></i> Expired</div>
              </div>
              <a style="cursor: pointer; float: right;" *ngIf="from === 'sent'"
                (click)="onClickRereferSent(caseViewData)"
                [ngClass]="{'btn-outline-primary btn-sm' : caseViewData.refercaseReRefferred === 'No', 'btn disabled' : caseViewData.refercaseReRefferred === 'Yes'}">Refer Case</a>
            </div>
            <!-- for doctorsList -->
            <div class="btns-" *ngIf="from === 'doctorsList'">
              <a style="cursor: pointer;" *ngIf="caseViewData.refercaseStatus === 'Pending'"
                class="btn btn-outline-primary btn-sm" (click)="openModalConfirm(caseViewData)">Confirm/Reschedule</a>
              <a style="cursor: pointer; margin-left: 5px;" *ngIf="caseViewData.refercaseStatus === 'Pending'"
                class="btn btn-outline-primary btn-sm" (click)="openModalReject(caseViewData)">Reject</a>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Accepted'">
                <div class="text-success" style="float: left; margin-top: 10px;"><img src="assets/img/check-icon.svg"
                    alt="" height="15px">Confirmed</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Expired'">
                <div class="text-muted" style="float: left; margin-top: 10px;"><i class="ti-na"></i> Expired</div>
              </div>
              <a style="cursor: pointer; float: right;" *ngIf="from === 'doctorsList' && caseViewData.refercaseStatus !== 'Pending'"
                (click)="onClickRereferDoctorsList(caseViewData)"
                [ngClass]="{'btn-outline-primary btn-sm' : caseViewData.refercaseReRefferred === 'No', 'btn disabled' : caseViewData.refercaseReRefferred === 'Yes' || caseViewData.refercaseStatus === 'Expired'}">Refer Case</a>
            </div>
            <!-- inside add-case -->
            <div class="btns-" *ngIf="from === 'add-case'">
              <a style="cursor: pointer;" *ngIf="caseViewData.refercaseStatus === 'Pending'"
                class="btn btn-outline-primary btn-sm" (click)="openModalConfirm(caseViewData)">Confirm/Reschedule</a>
              <a style="cursor: pointer; margin-left: 5px;" *ngIf="caseViewData.refercaseStatus === 'Pending'"
                class="btn btn-outline-primary btn-sm" (click)="openModalReject(caseViewData)">Reject</a>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Accepted'">
                <div class="text-success" style="float: left; margin-top: 10px;"><img src="assets/img/check-icon.svg"
                    alt="" height="15px">Confirmed</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Rejected'">
                <div class="text-danger" style="float: left; margin-top: 10px;"><img src="assets/img/close-icon.svg"
                    alt="" height="15px">Rejected</div>
              </div>
              <div class="col-md-4 text-xl-right btnsgrp-appointment"
                *ngIf="caseViewData.refercaseStatus === 'Expired'">
                <div class="text-muted" style="float: left; margin-top: 10px;"><i class="ti-na"></i> Expired</div>
              </div>
              <a style="cursor: pointer; float: right;" *ngIf="from === 'add-case' && caseViewData.refercaseStatus !== 'Pending'"
                (click)="onClickRereferAdd(caseViewData)"
                [ngClass]="{'btn-outline-primary btn-sm' : caseViewData.refercaseReRefferred === 'No', 'btn disabled' : caseViewData.refercaseReRefferred === 'Yes' || caseViewData.refercaseStatus === 'Expired'}">Refer Case</a>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-4 uploadfile-conten order-1 order-lg-2 card" style="border-radius:0;">
          <app-share-datetimepicker (updateView)="updateView()"></app-share-datetimepicker>
        </div>
      </div>
    </div>
  </section>
  <br>
</body>
`,
  styles: [`html, body {
    min-height: 100vh;
    height: auto;
    margin: 0;
  }
  .container{
    min-height:100vh;
}
.bottm{
  bottom: 8px;
}
a.disabled {
  color: gray;
  cursor: none;
  background-color: #6c757d;
  border-color: #6c757d;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .25rem;
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out
}
.btn-outline-primary {
  color: #007bff;
  display: inline-block;
  font-weight: 400;
  /* color: #212529; */
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .25rem;
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  border-color: #007bff;
}
.btn-outline-primary:hover {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.referred-btn:hover {
  color: rgb(40, 67, 190);
}
.sb-text {
  font-weight: bold;
}
.lengMax{
  min-width:320px;
}
.lengSmall{
  min-width:300px;
}`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewReferComponent implements OnInit {
  caseViewData: ReferCase;
  from: string;
  @Input() refercaseVisitDate: string;
  convertedTime: string;
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private facilityService: FacilityService,
    private location: Location,
    private store: Store
  ) { }
  bsModalRef: BsModalRef;
  preFixDRstr: string;
  preFixDRstrSent: string;
  getViewData = () => {
    return new Promise(resolve => {
      resolve(JSON.parse(this.store.referView).data);
    });
  }
  async ngOnInit(): Promise<void> {
    this.caseViewData = await this.getViewData() as ReferCase;
    this.from = JSON.parse(this.store.referView).from;
    this.refercaseVisitDate = this.caseViewData.refercaseVisitDate;
    const time = this.caseViewData.refercaseVisitTime !== null && this.caseViewData.refercaseVisitTime !== 'Undefined' ? this.tConvert(this.caseViewData.refercaseVisitTime) : '';
    this.convertedTime = time ? ` - ${time}` : '';
    this.preFixDRstr = this.caseViewData.refDocName ? this.caseViewData.refDocName.substr(0, 3) : '';
    this.preFixDRstrSent = this.caseViewData.doctorFullName ? this.caseViewData.doctorFullName.substr(0, 3) : '';
    this.cd.markForCheck();
  }

  onClickBack = () => {
    this.location.back();
  }
  updateView = () => {
    this.ngOnInit();
    this.cd.markForCheck();
  }

  openModalConfirm = (post: ReferCase) => {
    const initialState = {
      list: [{
        name: post.patientFirstName ? post.patientFirstName : 'Undefined',
        convertedTime: post.refercaseVisitTime ? this.tConvert(post.refercaseVisitTime) : 'Undefined',
        refercaseVisitTime: post.refercaseVisitTime ? post.refercaseVisitTime : '',
        genderAtZero: post.patientGender.charAt(0),
        refercaseVisitDate: post.refercaseOrgVisitDate,
        age: post.age ? post.age : '0',
        reasonName: post.reasonName ? post.reasonName : post.reasonNames,
        refercaseID: post.refercaseID,
        refSpecialityName: post.insuranceNames ? `/${post.insuranceNames}` : '',
        facilityID: post.facilityID,
        doctorID: post.doctorID
      }]
    };
    this.bsModalRef = this.modalService.show(ConfirmedReceivedModalComponent, { id: 200, initialState });
    this.bsModalRef.content.event.subscribe((res: string) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        setTimeout(() => {
          this.checkWhereToNavigateAccepted();
        }, 500);
      }
    });
  }
  openModalReject = (post: ReferCase) => {
    const initialState = {
      list: [{
        refercaseID: post.refercaseID,
        facilityID: post.facilityID,
        tzID: post.refercaseSentTZID ? post.refercaseSentTZID : '',
        doctorID: post.doctorID,
        url: this.router.url
      }]
    };
    this.store.setRejectrefer(JSON.stringify(post));
    this.bsModalRef = this.modalService.show(RejectReceivedModalComponent, { id: 911, initialState, class: 'modal-sm' });
    this.bsModalRef.content.event.subscribe((res: string) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        setTimeout(() => {
          this.checkWhereToNavigateRejected();
        }, 500);
      }
    });
  }
  checkWhereToNavigateAccepted = () => {
    const url = this.router.url.split('/');
    this.caseViewData.refercaseStatus = 'Accepted';
    if (`/${url[2]}` === '/facility-dashboard') {
      this.facilityService.forceReloadOther();
      const data = { data: this.caseViewData, from: 'dashboard' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-referral-received') {
      this.facilityService.forceReloadReceivedAll();
      const data = { data: this.caseViewData, from: 'received' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-referral-sent') {
      const data = { data: this.caseViewData, from: 'insideSent' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-notifications') {
      const data = { data: this.caseViewData, from: 'notifications' };
      this.store.setReferView(JSON.stringify(data));
    }
    this.router.navigate([`/${url[1]}/${url[2]}`]);
  }
  checkWhereToNavigateRejected = () => {
    const url = this.router.url.split('/');
    this.caseViewData.refercaseStatus = 'Rejected';
    if (`/${url[2]}` === '/facility-dashboard') {
      this.facilityService.forceReloadOther();
      const data = { data: this.caseViewData, from: 'dashboard' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-referral-received') {
      this.facilityService.forceReloadReceivedAll();
      const data = { data: this.caseViewData, from: 'received' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-referral-sent') {
      const data = { data: this.caseViewData, from: 'insideSent' };
      this.store.setReferView(JSON.stringify(data));
    }
    if (`/${url[2]}` === '/facility-notifications') {
      const data = { data: this.caseViewData, from: 'notifications' };
      this.store.setReferView(JSON.stringify(data));
    }
    this.router.navigate([`/${url[1]}/${url[2]}`]);
  }
  tConvert = (time: any) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    time[0] < 10 ? (time[0] = '0' + time[0]) : (time[0] = time[0]);
    return time[0] + '' + time[1] + '' + time[2] + ' ' + time[5];
  }

  onClickRereferDashboard = (data: ReferCase) => {
    data.from = 'dashboard';
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-dashboard/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferSent = (data: ReferCase) => {
    data.from = this.from && this.from === 'insideSent' ? 'unknown' : 'sent';
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-referral-sent/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferReceived = (data: ReferCase) => {
    data.from = 'received';
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-referral-received/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferDoctorsList = (data: ReferCase) => {
    data.from = 'doctor';
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-doctors-list/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferNotification = (data: ReferCase) => {
    data.from = 'notification';
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-notifications/re-refer-case']);
    this.cd.markForCheck();
  }
  onClickRereferAdd = (data: ReferCase) => {
    data.from = 'add';
    this.store.setRerefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-add-refer-case/re-refer-case']);
    this.cd.markForCheck();
  }
  editCase = (data: ReferCase) => {
    this.store.setEditrefer(JSON.stringify(data));
    this.router.navigate(['/facility/facility-referral-sent/edit-refer-case']);
  }
  deleteCase = (refercaseID: string) => {
    const initialState = {
      list: [{ refercaseID }]
    };
    this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, {
        id: 919,
        initialState,
        animated: false,
        ignoreBackdropClick: true,
        keyboard: false,
        // class: 'modal-dialog-centered'
      });
    this.bsModalRef.content.event.subscribe((res: string) => {
      const data = JSON.parse(res);
      if (data.res === 'confirmed') {
        this.facilityService.forceReloadSentList();
        const url = this.router.url.split('/');
        if (`/${url[2]}` === '/notifications') {
          this.facilityService.forceReloadNotify();
          this.store.setReferView(null);
        }
        this.location.back();
      }
    });
  }
  openImage = (src: string) => {
    ($ as any).magnificPopup.open({
      items: {
        src: `${src}`,
      },
      type: 'image'
    });
  }
  mail = (email?: string) => {
    window.location.href = `mailto:${email}?subject=&body=`; // add the links to body
  }
  phone = (phone?: string) => {
    window.location.href = `tel:${phone}`; // add the links to body
  }
}
