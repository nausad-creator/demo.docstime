import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Observable, timer, throwError, Subject, BehaviorSubject } from 'rxjs';
import { retry, catchError, switchMap, shareReplay, map, takeUntil, first } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import {
  AddEditReReferResponse,
  ChangeResponse,
  ChangeVerificationResponse,
  DashboardResponse,
  DeleteResponse,
  Doctors,
  NotifyResponse,
  ReceivedCount,
  ReceivedResponse,
  SentResponse
} from './docs.interface';
const VAPID_PUBLIC_KEY = 'BH9oatuz4hOXp3y--Nh5caxQBS9WzrfF_Pd4_bxysBpkQbaYi0q4iAVy1kYSNxBuVBefrrGVU6bATE69fjdY9Is';
const PRIVATE_KEY = 'b8C5w1EbG9sb2kIrUyPOqYA47u_hIeQK7-1xZvIXo9I';
const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 10000;
@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private reloadToday$ = new Subject<void>();
  private reloadOthers$ = new Subject<void>();
  private reloadUpcomming$ = new Subject<void>();
  private reloadPrivious$ = new Subject<void>();
  private reloadCancelled$ = new Subject<void>();
  private reloadReceivedAll$ = new Subject<void>();
  private reloadSentList$ = new Subject<void>();
  private reloadNotify$ = new Subject<void>();
  private referralReceivedCount$ = new Subject<void>();

  private todayAppontments$: Observable<Array<DashboardResponse>>;
  private otherAppointments$: Observable<Array<DashboardResponse>>;
  private referralReceivedUpcomming$: Observable<Array<ReceivedResponse>>;
  private referralReceivedPrivious$: Observable<Array<ReceivedResponse>>;
  private referralCancelled$: Observable<Array<ReceivedResponse>>;
  private referralReceivedListsAll$: Observable<Array<ReceivedResponse>>;
  private referralSentLists$: Observable<Array<SentResponse>>;
  private notifyList$: Observable<Array<NotifyResponse>>;
  private referralReceivedListsCount$: Observable<Array<ReceivedCount>>;
  // urls
  private changePasswordUrl = '/facilityuser/facilityuser-change-password';
  private updateProfileUrl = '/facilityuser/facilityuser-update-profile';
  private updateInfoUrl = '/facilityuser/facility-update-profile';
  private uploadFileUrl = '/doctor/file-upload';
  private notificationsUrl = '/facilityuser/facilityuser-update-notification-settings';
  private updateProfilePicUrl = '/facilityuser/facilityuser-profile-picture-update';
  private homeUrl = '/facilityuser/facility-home';
  private referralSentUrl = '/refercase/refer-sent-list';
  private referralReceivedUrl = '/refercase/refer-received-list';
  private confirmReferralUrl = '/refercase/accept-case';
  private rejectReferralUrl = '/refercase/reject-case';
  private createReferUrl = '/refercase/refer-new-case';
  private createreReferUrl = '/refercase/refer-existing-case';
  private editReferUrl = '/refercase/edit-refer-case';
  private notifyListsUrl = '/notification/get-notification-list';
  private updateNotifyUrl = '/notification/update-notification-read-status';
  private deleteNotifyUrl = '/notification/delete-notification';
  private notifyResetBadgeCountUrl = '/notification/reset-badge-count';
  private rejectReReferUrl = '/refercase/reject-re-refer-case';
  private doctorListUrl = '/doctor/doctor-list';
  private changeEmailMobileUrl = '/facilityuser/facilityuser-change-mobile-email';
  private changeOTPverificationUlr = '/facilityuser/change-otp-verification';
  private deleteCaseUrl = '/refercase/delete-case';

  constructor(private http: HttpClient, private swPush: SwPush) {
    this.update = new BehaviorSubject(this.filterUpdate);
    this.reset = new BehaviorSubject(this.filterReset);
    this.sortData = new BehaviorSubject(this.sort);
    this.isEmptyUpcoming = new BehaviorSubject(this.isEmptyUpcomming);
    this.isEmptyPrivious = new BehaviorSubject(this.isEmptyPrevious);
    this.isEmptyCancel = new BehaviorSubject(this.isEmptyCancelled);
  }
  // Behavior Subject
  filterUpdate: string;
  update: BehaviorSubject<string>;
  // Behavior Subject
  filterReset: string;
  reset: BehaviorSubject<string>;
  // Behavior Subject
  sort: string;
  sortData: BehaviorSubject<string>;
  // Behavior Subject
  isEmptyUpcomming = false;
  isEmptyUpcoming: BehaviorSubject<boolean>;
  // Behavior Subject
  isEmptyPrevious = false;
  isEmptyPrivious: BehaviorSubject<boolean>;
  // Behavior Subject
  isEmptyCancelled = false;
  isEmptyCancel: BehaviorSubject<boolean>;

  httpOptions = {
    headers: new HttpHeaders({}),
  };
  filter = (update: string) => {
    this.update.next(update);
  }
  sorting = (data: string) => {
    this.sortData.next(data);
  }
  resetFilter = (reset: string) => {
    this.reset.next(reset);
  }
  showUpcommingFiler = (isEmpty: boolean) => {
    this.isEmptyUpcoming.next(isEmpty);
  }
  showPreviousFiler = (isEmpty: boolean) => {
    this.isEmptyPrivious.next(isEmpty);
  }
  showCancelledFiler = (isEmpty: boolean) => {
    this.isEmptyCancel.next(isEmpty);
  }
  checkForChange = (data: string): Observable<Array<ChangeResponse>> => {
    const form = new FormData();
    const json = `[{
      "facilityuserID":"${JSON.parse(data).facilityuserID}",
      "changeFacilityuserMobile":"${JSON.parse(data).changeFacilityuserMobile}",
      "changeFacilityuserEmail":"${JSON.parse(data).changeFacilityuserEmail}",
      "changeFacilityuserOldMobile":"${JSON.parse(data).changeFacilityuserOldMobile}",
      "changeFacilityuserOldEmail":"${JSON.parse(data).changeFacilityuserOldEmail}",
      "languageID":"1",
      "apiType":"Android",
      "apiVersion":"1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<Array<ChangeResponse>>(environment.apiBaseUrl + this.changeEmailMobileUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  changeVerification = (data: string): Observable<Array<ChangeVerificationResponse>> => {
    const form = new FormData();
    const json = `[{
      "languageID":"${JSON.parse(data).languageID}",
      "facilityuserID":"${JSON.parse(data).facilityuserID}",
      "changeFacilityuserOTP":"${JSON.parse(data).changeFacilityuserOTP}",
      "apiType":"Android",
      "apiVersion":"1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<Array<ChangeVerificationResponse>>(environment.apiBaseUrl + this.changeOTPverificationUlr, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  deleteCase = (data: string): Observable<Array<DeleteResponse>> => {
    const form = new FormData();
    const json = `[{
      "apiType":"Android",
      "apiVersion":"1.0",
      "languageID":"${JSON.parse(data).languageID}",
      "refercaseID":"${JSON.parse(data).refercaseID}"
    }]`;
    form.append('json', json);
    return this.http
      .post<Array<DeleteResponse>>(environment.apiBaseUrl + this.deleteCaseUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  searchDoctors = (searchWord: string): Observable<Array<Doctors>> => {
    const form = new FormData();
    const json = `[{
      "referCaseSearch":"${true}",
      "searchWord":"${searchWord}",
      "languageID":"1",
      "apiType":"Android",
      "apiVersion":"1.0"
      }]`;
    form.append('json', json);
    return this.http
      .post<Array<Doctors>>(environment.apiBaseUrl + this.doctorListUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  facChangePassword(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
    "facilityuserID": "${JSON.parse(data).facilityuserID}",
    "facilityuserCurrentPassword": "${JSON.parse(data).facilityuserCurrentPassword}",
    "languageID": "${JSON.parse(data).languageID}",
    "facilityNewPassword": "${JSON.parse(data).facilityNewPassword}",
    "apiType": "Android",
    "apiVersion": "1.0"
  }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.changePasswordUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  updateProfilePic(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "facilityuserID": "${JSON.parse(data).facilityuserID}",
      "facilityuserImage": "${JSON.parse(data).facilityuserImage}",
      "languageID": "${JSON.parse(data).languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.updateProfilePicUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  updateNotifications(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "${JSON.parse(data).languageID}",
      "facilityuserID": "${JSON.parse(data).facilityuserID}",
      "facilityuserAppointmentPush": "${JSON.parse(data).facilityuserAppointmentPush}",
      "facilityuserAdminPush": "${JSON.parse(data).facilityuserAdminPush}",
      "facilityuserRatingPush": "${JSON.parse(data).facilityuserRatingPush}",
      "facilityuserReferredCasePush": "${JSON.parse(data).facilityuserReferredCasePush}",
      "facilityuserDeviceType": "Android",
      "facilityuserDeviceID": "Yes",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.notificationsUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  updateProfile(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "facilityuserID": "${JSON.parse(data).facilityuserID}",
      "facilityuserFirstName": "${JSON.parse(data).facilityuserFirstName}",
      "facilityuserLastName": "${JSON.parse(data).facilityuserLastName}",
      "facilityuserEmail": "${JSON.parse(data).facilityuserEmail}",
      "facilityuserMobile": "${JSON.parse(data).facilityuserMobile}",
      "facilityuserGender": "${JSON.parse(data).facilityuserGender}",
      "facilityuserDOB": "${JSON.parse(data).facilityuserDOB}",
      "facilityName": "${JSON.parse(data).facilityName}",
      "facilityAbout": "${JSON.parse(data).facilityAbout}",
      "facilityuserImage": "${JSON.parse(data).facilityuserImage}",
      "facilityuserStatus": "Active",
      "facilityuserDeviceType": "",
      "facilityuserDeviceID": "",
      "languageID": "${JSON.parse(data).languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.updateProfileUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  updateInfo(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "facilityuserID":"${JSON.parse(data).facilityuserID}",
      "facilityName":"${JSON.parse(data).facilityName}",
      "facilityEmail":"${JSON.parse(data).facilityEmail}",
      "facilityContactNumber":"${JSON.parse(data).facilityContactNumber}",
      "facilityAddress":"${JSON.parse(data).facilityAddress}",
      "facilityLatitude":"",
      "facilityLongitude":"",
      "languageID":"${JSON.parse(data).languageID}",
      "apiType":"Android",
      "apiVersion":"1.0"
      }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.updateInfoUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  addRefer(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${JSON.parse(data).languageID}",
      "patientEmail": "${JSON.parse(data).patientEmail}",
      "patientFirstName": "${JSON.parse(data).patientFirstName}",
      "patientDOB": "${JSON.parse(data).patientDOB}",
      "patientCountryCode": "${JSON.parse(data).patientCountryCode}",
      "patientMobile": "${JSON.parse(data).patientMobile}",
      "patientGender": "${JSON.parse(data).patientGender}",
      "facilityID": "${JSON.parse(data).facilityID}",
      "specialityID": "${JSON.parse(data).specialityID}",
      "reasonID": "${JSON.parse(data).reasonID}",
      "reasonIDs": "${JSON.parse(data).reasonIDs}",
      "reasonNames": "${JSON.parse(data).reasonNames}",
      "refercaseUrgent": "${JSON.parse(data).refercaseUrgent}",
      "refercaseDescription": "${JSON.parse(data).refercaseDescription}",
      "refercaseNPI": "${JSON.parse(data).refercaseNPI}",
      "insuranceNames": "${JSON.parse(data).insuranceNames}",
      "refercaseVisitDate": "${JSON.parse(data).refercaseVisitDate}",
      "refercaseVisitTime": "${JSON.parse(data).refercaseVisitTime}",
      "doctorID": "${JSON.parse(data).doctorID}",
      "refercaseHospitalAdmission": "${JSON.parse(data).refercaseHospitalAdmission}",
      "documents": ${JSON.stringify(JSON.parse(data).documents)}
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.createReferUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  addreRefer(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${JSON.parse(data).languageID}",
      "refercaseID": "${JSON.parse(data).refercaseID}",
      "facilityID": "${JSON.parse(data).facilityID}",
      "specialityID": "${JSON.parse(data).specialityID}",
      "reasonID": "${JSON.parse(data).reasonID}",
      "reasonIDs": "${JSON.parse(data).reasonIDs}",
      "reasonNames": "${JSON.parse(data).reasonNames}",
      "refercaseUrgent": "${JSON.parse(data).refercaseUrgent}",
      "refercaseDescription": "${JSON.parse(data).refercaseDescription}",
      "refercaseNPI": "${JSON.parse(data).refercaseNPI}",
      "refercaseVisitDate": "${JSON.parse(data).refercaseVisitDate}",
      "refercaseVisitTime": "${JSON.parse(data).refercaseVisitTime}",
      "insuranceNames": "${JSON.parse(data).insuranceNames}",
      "refercaseHospitalAdmission": "${JSON.parse(data).refercaseHospitalAdmission}",
      "doctorID": "${JSON.parse(data).doctorID}",
      "refercaseOrgCaseID": "${JSON.parse(data).refercaseOrgCaseID}",
      "documents": ${JSON.stringify(JSON.parse(data).documents)}
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.createreReferUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  editRefer(data: string): Observable<Array<AddEditReReferResponse>> {
    const form = new FormData();
    const json = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${JSON.parse(data).languageID}",
      "patientEmail": "${JSON.parse(data).patientEmail}",
      "patientFirstName": "${JSON.parse(data).patientFirstName}",
      "patientDOB": "${JSON.parse(data).patientDOB}",
      "patientCountryCode": "${JSON.parse(data).patientCountryCode}",
      "patientMobile": "${JSON.parse(data).patientMobile}",
      "patientGender": "${JSON.parse(data).patientGender}",
      "facilityID": "${JSON.parse(data).facilityID}",
      "specialityID": "${JSON.parse(data).specialityID}",
      "reasonID": "${JSON.parse(data).reasonID}",
      "reasonIDs": "${JSON.parse(data).reasonIDs}",
      "reasonNames": "${JSON.parse(data).reasonNames}",
      "insuranceNames": "${JSON.parse(data).insuranceNames}",
      "refercaseUrgent": "${JSON.parse(data).refercaseUrgent}",
      "refercaseDescription": "${JSON.parse(data).refercaseDescription}",
      "refercaseNPI": "${JSON.parse(data).refercaseNPI}",
      "refercaseVisitDate": "${JSON.parse(data).refercaseVisitDate}",
      "refercaseVisitTime": "${JSON.parse(data).refercaseVisitTime}",
      "doctorID": "${JSON.parse(data).doctorID}",
      "refercaseHospitalAdmission": "${JSON.parse(data).refercaseHospitalAdmission}",
      "documents": ${JSON.stringify(JSON.parse(data).documents)},
      "refercaseID":"${JSON.parse(data).refercaseID}",
      "patientID":"${JSON.parse(data).patientID}",
      "tzID":"${JSON.parse(data).tzID}"
    }]`;
    form.append('json', json);
    return this.http
      .post<Array<AddEditReReferResponse>>(environment.apiBaseUrl + `${this.editReferUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  today = (data: string): Observable<Array<DashboardResponse>> => {
    if (!this.todayAppontments$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.todayAppontments$ = timer$.pipe(
        switchMap(_ => this.facDashboardToday(data)),
        takeUntil(this.reloadToday$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.todayAppontments$;
  }
  other = (data: string): Observable<Array<DashboardResponse>> => {
    if (!this.otherAppointments$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.otherAppointments$ = timer$.pipe(
        switchMap(_ => this.facDashboardOther(data)),
        takeUntil(this.reloadOthers$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.otherAppointments$;
  }
  facDashboardToday(data: string): Observable<Array<DashboardResponse>> {
    const form = new FormData();
    const json = `[{
      "facilityuserID": "${JSON.parse(data).facilityuserID}",
      "facilityID": "${JSON.parse(data).facilityID}",
      "languageID": "${JSON.parse(data).languageID}",
      "refercaseStatus":"${JSON.parse(data).refercaseStatus}",
      "patientName":"${JSON.parse(data).patientName}",
      "referbydoctorName":"${JSON.parse(data).referbydoctorName}",
      "insuranceNames":"${JSON.parse(data).insuranceNames}",
      "patientGender":"${JSON.parse(data).patientGender}",
      "refercaseUrgent":"${JSON.parse(data).refercaseUrgent}",
      "reasonIDs":"${JSON.parse(data).reasonIDs}",
      "refercaseVisitTime":"${JSON.parse(data).refercaseVisitTime}",
      "startDate":"${JSON.parse(data).startDate}",
      "endDate":"${JSON.parse(data).endDate}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<Array<DashboardResponse>>(environment.apiBaseUrl + '' + this.homeUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  facDashboardOther(data: string): Observable<Array<DashboardResponse>> {
    const form = new FormData();
    const json = `[{
      "facilityuserID": "${JSON.parse(data).facilityuserID}",
      "facilityID": "${JSON.parse(data).facilityID}",
      "languageID": "${JSON.parse(data).languageID}",
      "refercaseStatus":"${JSON.parse(data).refercaseStatus}",
      "patientName":"${JSON.parse(data).patientName}",
      "referbydoctorName":"${JSON.parse(data).referbydoctorName}",
      "insuranceNames":"${JSON.parse(data).insuranceNames}",
      "patientGender":"${JSON.parse(data).patientGender}",
      "refercaseUrgent":"${JSON.parse(data).refercaseUrgent}",
      "reasonIDs":"${JSON.parse(data).reasonIDs}",
      "refercaseVisitTime":"${JSON.parse(data).refercaseVisitTime}",
      "startDate":"${JSON.parse(data).startDate}",
      "endDate":"${JSON.parse(data).endDate}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<Array<DashboardResponse>>(environment.apiBaseUrl + `${this.homeUrl}`, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  referralReceivedUpcomming = (data: string): Observable<Array<ReceivedResponse>> => {
    if (!this.referralReceivedUpcomming$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.referralReceivedUpcomming$ = timer$.pipe(
        switchMap(_ => this.referralReceivedLists(data)),
        takeUntil(this.reloadUpcomming$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.referralReceivedUpcomming$;
  }
  referralReceivedPrivious = (data: string): Observable<Array<ReceivedResponse>> => {
    if (!this.referralReceivedPrivious$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.referralReceivedPrivious$ = timer$.pipe(
        switchMap(_ => this.referralReceivedLists(data)),
        takeUntil(this.reloadPrivious$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.referralReceivedPrivious$;
  }
  referralCancelled = (data: string): Observable<Array<ReceivedResponse>> => {
    if (!this.referralCancelled$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.referralCancelled$ = timer$.pipe(
        switchMap(_ => this.referralReceivedLists(data)),
        takeUntil(this.reloadCancelled$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.referralCancelled$;
  }
  referralReceivedAll = (data: string): Observable<Array<ReceivedResponse>> => {
    if (!this.referralReceivedListsAll$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.referralReceivedListsAll$ = timer$.pipe(
        switchMap(_ => this.referralReceivedLists(data)),
        takeUntil(this.reloadReceivedAll$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.referralReceivedListsAll$;
  }
  referralReceivedLists(data: string): Observable<Array<ReceivedResponse>> {
    const form = new FormData();
    const json = `[{
      "apiType":"Android",
      "apiVersion":"1.0",
      "languageID":"${JSON.parse(data).languageID}",
      "facilityID":"${JSON.parse(data).facilityID}",
      "refercaseStatus":"${JSON.parse(data).refercaseStatus}",
      "patientName":"${JSON.parse(data).patientName}",
      "referbydoctorName":"${JSON.parse(data).referbydoctorName}",
      "insuranceNames":"${JSON.parse(data).insuranceNames}",
      "patientGender":"${JSON.parse(data).patientGender}",
      "refercaseUrgent":"${JSON.parse(data).refercaseUrgent}",
      "reasonIDs":"${JSON.parse(data).reasonIDs}",
      "refercaseVisitTime":"${JSON.parse(data).refercaseVisitTime}",
      "startDate":"${JSON.parse(data).startDate}",
      "endDate":"${JSON.parse(data).endDate}",
      "page":"${JSON.parse(data).page}",
      "pagesize":"20",
      "doctorID":"${JSON.parse(data).doctorID}"
      }]`;
    form.append('json', json);
    return this.http
      .post<Array<ReceivedResponse>>(environment.apiBaseUrl + `${this.referralReceivedUrl}`, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  referralReceivedCount = (data: string) => {
    if (!this.referralReceivedListsCount$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.referralReceivedListsCount$ = timer$.pipe(
        switchMap(_ => this.referralReceivedListsForCount(data)),
        takeUntil(this.referralReceivedCount$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.referralReceivedListsCount$;
  }
  referralReceivedListsForCount(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "apiType":"Android",
      "apiVersion":"1.0",
      "languageID":"${JSON.parse(data).languageID}",
      "facilityID":"${JSON.parse(data).facilityID}",
      "refercaseStatus":"${JSON.parse(data).refercaseStatus}",
      "startDate":"${JSON.parse(data).startDate}",
      "endDate":"${JSON.parse(data).endDate}",
      "page":"${JSON.parse(data).page}",
      "pagesize":"20",
      "doctorID":"${JSON.parse(data).doctorID}"
      }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.referralReceivedUrl}`, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  referralSent = (data: string): Observable<Array<SentResponse>> => {
    if (!this.referralSentLists$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.referralSentLists$ = timer$.pipe(
        switchMap(_ => this.referralSentLists(data)),
        takeUntil(this.reloadSentList$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.referralSentLists$;
  }
  referralSentLists(data: string): Observable<Array<SentResponse>> {
    const form = new FormData();
    const json = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${JSON.parse(data).languageID}",
      "facilityID": "${JSON.parse(data).facilityID}",
      "refercaseStatus": "${JSON.parse(data).refercaseStatus}",
      "patientName":"${JSON.parse(data).patientName}",
      "referbydoctorName":"${JSON.parse(data).referbydoctorName}",
      "insuranceNames":"${JSON.parse(data).insuranceNames}",
      "patientGender":"${JSON.parse(data).patientGender}",
      "refercaseUrgent":"${JSON.parse(data).refercaseUrgent}",
      "reasonIDs":"${JSON.parse(data).reasonIDs}",
      "refercaseVisitTime":"${JSON.parse(data).refercaseVisitTime}",
      "startDate":"${JSON.parse(data).startDate}",
      "endDate":"${JSON.parse(data).endDate}",
      "page": "${JSON.parse(data).page}",
      "pagesize": "10",
      "doctorID": "${JSON.parse(data).doctorID}"
    }]`;
    form.append('json', json);
    return this.http
      .post<Array<SentResponse>>(environment.apiBaseUrl + `${this.referralSentUrl}`, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  notifyList = (data: string): Observable<Array<NotifyResponse>> => {
    if (!this.notifyList$) {
      this.notifyList$ = this.notificationLists(data).pipe(
        takeUntil(this.reloadNotify$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.notifyList$;
  }
  notificationLists(data: string): Observable<Array<NotifyResponse>> {
    const form = new FormData();
    const json = `[{
      "loginuserID":"${JSON.parse(data).loginuserID}",
      "languageID":"${JSON.parse(data).languageID}",
      "userType":"Facility",
      "page":"${JSON.parse(data).page}",
      "pagesize":"10",
      "apiType":"web",
      "apiVersion":"1.0"
      }]`;
    form.append('json', json);
    return this.http
      .post<Array<NotifyResponse>>(environment.apiBaseUrl + `${this.notifyListsUrl}`, form, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  referralReceived(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "apiType":"Android",
      "apiVersion":"1.0",
      "languageID":"${'1'}",
      "facilityID":"${JSON.parse(data).facilityID}",
      "refercaseStatus":"${''}",
      "refercaseID":"${JSON.parse(data).refercaseID}",
      "page":"${'0'}",
      "pagesize":"1",
      "doctorID":"${'0'}"
      }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.referralReceivedUrl}`, form, this.httpOptions)
      .pipe(map(res => res[0].data), retry(2), catchError(this.handleError));
  }
  resetBadgeNotify(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID":"${JSON.parse(data).loginuserID}",
      "languageID":"${JSON.parse(data).languageID}",
      "userType": "Facilityuser",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.notifyResetBadgeCountUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  updateNotificaStatus(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID": "${JSON.parse(data).loginuserID}",
      "languageID": "${JSON.parse(data).languageID}",
      "notificationID": "${JSON.parse(data).notificationID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.updateNotifyUrl}`, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  deleteNotification(data: string): Observable<Array<DeleteResponse>> {
    const form = new FormData();
    const json = `[{
      "loginuserID": "${JSON.parse(data).loginuserID}",
      "languageID": "${JSON.parse(data).languageID}",
      "notificationID": "${JSON.parse(data).notificationID}",
      "startDate": "${JSON.parse(data).startDate}",
      "endDate": "${JSON.parse(data).endDate}",
      "deleteAll": "${JSON.parse(data).deleteAll}",
      "userType": "Facility",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<Array<DeleteResponse>>(environment.apiBaseUrl + `${this.deleteNotifyUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  acceptReferral(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${JSON.parse(data).languageID}",
      "refercaseID": "${JSON.parse(data).refercaseID}",
      "facilityID": "${JSON.parse(data).facilityID}",
      "newDate": "${JSON.parse(data).newDate}",
      "newTime": "${JSON.parse(data).newTime}",
      "doctorID": "${JSON.parse(data).doctorID}"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.confirmReferralUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  rejectReferral(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${JSON.parse(data).languageID}",
      "refercaseID": "${JSON.parse(data).refercaseID}",
      "tzID": "${JSON.parse(data).tzID}",
      "timelineRemarks": "${JSON.parse(data).timelineRemarks}",
      "newDate": "${JSON.parse(data).newDate}",
      "newTime": "${JSON.parse(data).newTime}",
      "doctorID": "${JSON.parse(data).doctorID}",
      "facilityID":"${JSON.parse(data).facilityID}"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.rejectReferralUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  rejectReRefer(data: string): Observable<Array<AddEditReReferResponse>> {
    const form = new FormData();
    const json = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${JSON.parse(data).languageID}",
      "refercaseID": "${JSON.parse(data).refercaseID}",
      "refercaseHospitalAdmission":"${JSON.parse(data).refercaseHospitalAdmission}",
      "refercaseUrgent":"${JSON.parse(data).refercaseUrgent}",
      "facilityID": "${JSON.parse(data).facilityID}",
      "specialityID": "${JSON.parse(data).specialityID}",
      "reasonID": "${JSON.parse(data).reasonID}",
      "refercaseVisitDate":"${JSON.parse(data).refercaseVisitDate}",
      "refercaseVisitTime": "${JSON.parse(data).refercaseVisitTime}",
      "doctorID": "${JSON.parse(data).doctorID}",
      "refercaseOrgCaseID":"${JSON.parse(data).refercaseOrgCaseID}",
      "documents": ${JSON.stringify(JSON.parse(data).documents)},
      "tzID":"${JSON.parse(data).tzID}"
    }]`;
    form.append('json', json);
    return this.http
      .post<Array<AddEditReReferResponse>>(environment.apiBaseUrl + `${this.rejectReReferUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  unSubscribe = () => {
    this.todayAppontments$ = null;
    this.otherAppointments$ = null;
    this.referralReceivedUpcomming$ = null;
    this.referralReceivedPrivious$ = null;
    this.referralCancelled$ = null;
    this.referralSentLists$ = null;
    this.referralReceivedListsAll$ = null;
    this.notifyList$ = null;
    this.referralReceivedListsCount$ = null;
    this.reloadReceivedAll$.next();
    this.referralReceivedCount$.next();
    this.reloadSentList$.next();
    this.reloadUpcomming$.next();
    this.reloadPrivious$.next();
    this.reloadCancelled$.next();
    this.reloadToday$.next();
    this.reloadOthers$.next();
    this.reloadNotify$.next();
  }
  // uploading files
  uploadFile(fileData: any): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID": "${fileData.logindoctorID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    form.append('FileField', fileData.file);
    form.append('fileName', fileData.fileName);
    form.append('FilePath', fileData.filePath);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.uploadFileUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  // this is for progress for file upload
  file = (filedata: any) => {
    const req = new HttpRequest('POST', this.uploadFileUrl, filedata.file, {
      reportProgress: true,
    });
    this.http.request(req).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        // nothing('File is completely uploaded!');
      }
    });
  }
  // ErrorHandling
  handleError = (error: { error: { messages: string; }; status: any; messsage: any; }) => {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get Client Side Error
      errorMessage = error.error.messages;
    } else {
      // Get Server-Side Error
      errorMessage = `Error Code : ${error.status}\nMessage : ${error.messsage}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }
  // Public facing API to force the cache to reload the data
  forceReloadToday = () => {
    this.reloadToday$.next();
    this.todayAppontments$ = null;
  }
  forceReloadOther = () => {
    this.reloadOthers$.next();
    this.otherAppointments$ = null;
  }
  forceReloadUpcomming = () => {
    this.reloadUpcomming$.next();
    this.referralReceivedUpcomming$ = null;
  }
  forceReloadPrivious = () => {
    this.reloadPrivious$.next();
    this.referralReceivedPrivious$ = null;
  }
  forceReloadCancel = () => {
    this.reloadCancelled$.next();
    this.referralCancelled$ = null;
  }
  forceReloadSentList = () => {
    this.reloadSentList$.next();
    this.referralSentLists$ = null;
  }
  forceReloadReceivedAll = () => {
    this.reloadReceivedAll$.next();
    this.referralReceivedListsAll$ = null;
  }
  forceReloadNotify = () => {
    this.reloadNotify$.next();
    this.notifyList$ = null;
  }
  forceReloadCount = () => {
    this.referralReceivedCount$.next();
    this.referralReceivedListsCount$ = null;
  }

  checkRequestPermission = () => {
    if (('PushManager' in window) && this.swPush.isEnabled) {
      this.swPush.subscription.pipe(first()).subscribe(pushSubscription => {
        if (pushSubscription) {
          // saving subscription credentials in DB on server
          console.log(pushSubscription);
        }
        if (pushSubscription === null) {
          this.request();
        }
      });
    }
  }
  request = () => {
    this.swPush.requestSubscription({
      serverPublicKey: VAPID_PUBLIC_KEY
    }).then(subscription => {
      // send subscription to the server
      console.log(subscription);
    }).catch(console.error);
  }
  listeningToMessage = () => {
    this.swPush.messages.pipe(map(res => res)).subscribe(res => console.log(res), err => console.log(err));
  }
  unSubs = () => {
    this.swPush.unsubscribe().then(() => console.log('Unsubscribed from doc-facility')).catch(() => console.log('No subs active'));
  }
}
