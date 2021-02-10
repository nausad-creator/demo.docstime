import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Observable, Subject, throwError, timer } from 'rxjs';
import { catchError, first, map, retry, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from './../../environments/environment';
const VAPID_PUBLIC_KEY = 'BH1qsmrEpQmZuyOUD8Ak2WX7DBjS1wubD8Rx_Un_5FewIObj-tSQXjFh4K1gHTpG0z88dCWdXSAwab8xOsn76WY';
const PRIVATE_KEY = 'Jb8HPpMSHdbhCZ1qSCWZN-suggG3zwjJMgbW_-sgbJ8';
const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 10000;
@Injectable({
  providedIn: 'root'
})
export class DocsService {
  private reloadToday$ = new Subject<void>();
  private reloadOthers$ = new Subject<void>();
  private reloadUpcomming$ = new Subject<void>();
  private reloadPrivious$ = new Subject<void>();
  private reloadReceivedAll$ = new Subject<void>();
  private reloadSentList$ = new Subject<void>();
  private reloadNotify$ = new Subject<void>();
  private referralReceivedCount$ = new Subject<void>();

  private todayAppontments$: Observable<Array<any>>;
  private otherAppointments$: Observable<Array<any>>;
  private referralReceivedUpcomming$: Observable<Array<any>>;
  private referralReceivedPrivious$: Observable<Array<any>>;
  private referralReceivedListsAll$: Observable<Array<any>>;
  private referralSentLists$: Observable<Array<any>>;
  private notifyList$: Observable<Array<any>>;
  private referralReceivedListsCount$: Observable<Array<any>>;
  // urls
  private changePasswordUrl = '/doctor/change-password';
  private updateProfileUrl = '/doctor/doctor-update-profile';
  private uploadFileUrl = '/doctor/file-upload';
  private notificationsUrl = '/doctor/doctor-update-notification-settings';
  private updateProfilePicUrl = '/doctor/doctor-update-profile-picture';
  private homeUrl = '/doctor/doctor-home';
  private referralSentUrl = '/refercase/refer-sent-list';
  private referralReceivedUrl = '/refercase/refer-received-list';
  private confirmReferralUrl = '/refercase/accept-case';
  private rejectReferralUrl = '/refercase/reject-case';
  private createReferUrl = '/refercase/refer-new-case';
  private createreReferUrl = '/refercase/refer-existing-case';
  private notifyListsUrl = '/notification/get-notification-list';
  private updateNotifyUrl = '/notification/update-notification-read-status';
  private deleteNotifyUrl = '/notification/delete-notification';
  private notifyResetBadgeCountUrl = '/notification/reset-badge-count';

  constructor(private http: HttpClient, private swPush: SwPush) { }

  httpOptions = {
    headers: new HttpHeaders({}),
  };

  docChangePassword(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
    "logindoctorID": "${JSON.parse(data).logindoctorID}",
    "doctorCurrentPassword": "${JSON.parse(data).doctorCurrentPassword}",
    "languageID": "${JSON.parse(data).languageID}",
    "doctorNewPassword": "${JSON.parse(data).doctorNewPassword}",
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
      "languageID": "${JSON.parse(data).languageID}",
      "logindoctorID": "${JSON.parse(data).logindoctorID}",
      "doctorProfileImage": "${JSON.parse(data).doctorProfileImage}",
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
      "logindoctorID": "${JSON.parse(data).logindoctorID}",
      "doctorAppointmentPush": "${JSON.parse(data).doctorAppointmentPush}",
      "doctorAdminPush": "${JSON.parse(data).doctorAdminPush}",
      "doctorRatingPush": "${JSON.parse(data).doctorRatingPush}",
      "doctorReferredCasePush": "${JSON.parse(data).doctorReferredCasePush}",
      "doctorDeviceType": "Android",
      "doctorDeviceID": "Yes",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.notificationsUrl}`, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  docUpdateProfile(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
    "languageID": "${JSON.parse(data).languageID}",
    "logindoctorID":"${JSON.parse(data).logindoctorID}",
    "doctorDOB":"${JSON.parse(data).doctorDOB}",
    "doctorEmail":"${JSON.parse(data).doctorEmail}",
    "doctorMobile":"${JSON.parse(data).doctorMobile}",
    "doctorFullName":"${JSON.parse(data).doctorFullName}",
    "doctorFirstName":"${JSON.parse(data).doctorFirstName}",
    "doctorLastName":"${JSON.parse(data).doctorLastName}",
    "specialityIDs":"${JSON.parse(data).specialityIDs}",
    "doctorGender":"${JSON.parse(data).doctorGender}",
    "doctorFax": "${JSON.parse(data).doctorFax}",
    "doctorProfileImage":"${JSON.parse(data).doctorProfileImage}",
    "doctorDeviceType": "Android",
    "doctorDeviceID": "xczxcxzczxczxcxcxc",
    "degreeID":"${JSON.parse(data).degreeID}",
    "doctorAbout":"${JSON.parse(data).doctorAbout}",
    "doctorAddress":"${JSON.parse(data).doctorAddress}",
    "doctorLatitude":"22.991681",
    "doctorLongitude":"72.470936",
    "apiType": "Android",
    "apiVersion": "1.0"
  }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.updateProfileUrl}`, form, this.httpOptions)
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
      "insuranceNames": "${JSON.parse(data).insuranceNames}",
      "refercaseUrgent": "${JSON.parse(data).refercaseUrgent}",
      "refercaseDescription": "${JSON.parse(data).refercaseDescription}",
      "refercaseNPI": "${JSON.parse(data).refercaseNPI}",
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
  forceReloadToday = () => {
    this.reloadToday$.next();
    this.todayAppontments$ = null;
  }
  today = (data: string) => {
    if (!this.todayAppontments$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.todayAppontments$ = timer$.pipe(
        switchMap(_ => this.docDashboardToday(data)),
        takeUntil(this.reloadToday$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.todayAppontments$;
  }
  forceReloadOther = () => {
    this.reloadOthers$.next();
    this.otherAppointments$ = null;
  }
  other = (data: string) => {
    if (!this.otherAppointments$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.otherAppointments$ = timer$.pipe(
        switchMap(_ => this.docDashboardOther(data)),
        takeUntil(this.reloadOthers$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.otherAppointments$;
  }
  docDashboardToday(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "${JSON.parse(data).languageID}",
      "logindoctorID":"${JSON.parse(data).logindoctorID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.homeUrl}`, form, this.httpOptions)
      .pipe(map(res => res[0].today), retry(2), catchError(this.handleError));
  }
  docDashboardOther(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "${JSON.parse(data).languageID}",
      "logindoctorID":"${JSON.parse(data).logindoctorID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.homeUrl}`, form, this.httpOptions)
      .pipe(map(res => res[0].other), retry(2), catchError(this.handleError));
  }
  forceReloadUpcomming = () => {
    this.reloadUpcomming$.next();
    this.referralReceivedUpcomming$ = null;
  }
  referralReceivedUpcomming = (data: string) => {
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
  forceReloadPrivious = () => {
    this.reloadPrivious$.next();
    this.referralReceivedPrivious$ = null;
  }
  referralReceivedPrivious = (data: string) => {
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
  forceReloadReceivedAll = () => {
    this.reloadReceivedAll$.next();
    this.referralReceivedListsAll$ = null;
  }
  referralReceivedAll = (data: string) => {
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
  referralReceivedLists(data: string): Observable<any> {
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
      .pipe(map(res => res[0].data), retry(2),
        catchError(this.handleError));
  }
  forceReloadCount = () => {
    this.referralReceivedCount$.next();
    this.referralReceivedListsCount$ = null;
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
  forceReloadSentList = () => {
    this.reloadSentList$.next();
    this.referralSentLists$ = null;
  }
  referralSent = (data: string) => {
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
  referralSentLists(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "apiType": "Android",
      "apiVersion": "1.0",
      "languageID": "${JSON.parse(data).languageID}",
      "facilityID": "${JSON.parse(data).facilityID}",
      "refercaseStatus": "${JSON.parse(data).refercaseStatus}",
      "page": "${JSON.parse(data).page}",
      "pagesize": "10",
      "doctorID": "${JSON.parse(data).doctorID}"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.referralSentUrl}`, form, this.httpOptions)
      .pipe(map(res => res[0].data), retry(2),
        catchError(this.handleError));
  }
  forceReloadNotify = () => {
    this.reloadNotify$.next();
    this.notifyList$ = null;
  }
  notifyList = (data: string) => {
    if (!this.notifyList$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.notifyList$ = timer$.pipe(
        switchMap(_ => this.notificationLists(data)),
        takeUntil(this.reloadNotify$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.notifyList$;
  }
  notificationLists(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID":"${JSON.parse(data).loginuserID}",
      "languageID":"${JSON.parse(data).languageID}",
      "userType":"Doctor",
      "page":"${JSON.parse(data).page}",
      "pagesize":"10",
      "apiType":"web",
      "apiVersion":"1.0"
      }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + `${this.notifyListsUrl}`, form, this.httpOptions)
      .pipe(map(res => res[0].data), retry(2), catchError(this.handleError));
  }
  referralReceived(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "apiType":"Android",
      "apiVersion":"1.0",
      "languageID":"${'1'}",
      "facilityID":"${'0'}",
      "refercaseStatus":"${''}",
      "refercaseID":"${JSON.parse(data).refercaseID}",
      "page":"${'0'}",
      "pagesize":"1",
      "doctorID":"${JSON.parse(data).doctorID}"
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
      "userType": "Doctor",
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
  deleteNotification(data: string): Observable<any> {
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
      .post<any>(environment.apiBaseUrl + `${this.deleteNotifyUrl}`, form, this.httpOptions)
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
  unSubscribe = () => {
    this.todayAppontments$ = null;
    this.otherAppointments$ = null;
    this.referralReceivedUpcomming$ = null;
    this.referralReceivedPrivious$ = null;
    this.referralReceivedListsAll$ = null;
    this.referralSentLists$ = null;
    this.referralReceivedListsCount$ = null;
    this.notifyList$ = null;
    this.reloadReceivedAll$.next();
    this.referralReceivedCount$.next();
    this.reloadSentList$.next();
    this.reloadUpcomming$.next();
    this.reloadPrivious$.next();
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
      }
    });
  }
  // ErrorHandling
  handleError = (error: { error: { messages: string; }; status: any; messsage: any; }) => {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.messages;
    } else {
      errorMessage = `Error Code : ${error.status}\nMessage : ${error.messsage}`;
    }
    return throwError(errorMessage);
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
    this.swPush.requestSubscription({ serverPublicKey: VAPID_PUBLIC_KEY }).then(subscription => {
      // send subscription to the server
      console.log(subscription);
    }).catch(console.error);
  }

  listeningToMessage = () => {
    this.swPush.messages.pipe(map(res => res)).subscribe(res => console.log(res), err => console.log(err));
  }

  unSubs = () => {
    this.swPush.unsubscribe().then(() => console.log('Unsubscribed from doc-refer')).catch(() => console.log('No subs active'));
  }
}
