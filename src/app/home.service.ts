import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, retry, shareReplay, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private reload$ = new Subject<void>();
  // Variables Declaration Of Type Observable
  private cmsAboutUs$: Observable<Array<any>>;
  private cmsContactUs$: Observable<Array<any>>;
  private cmsTermsAndConditions$: Observable<Array<any>>;
  private cmsPrivacyPolicy$: Observable<Array<any>>;
  private cmsDoctorPrivacyPolicy$: Observable<Array<any>>;
  private faq$: Observable<Array<any>>;
  private speciality$: Observable<Array<any>>;
  private reasonsLists$: Observable<Array<any>>;
  private degree$: Observable<Array<any>>;
  private document$: Observable<Array<any>>;
  private insurance$: Observable<Array<any>>;
  private doctors$: Observable<Array<any>>;
  private footerContent$: Observable<Array<any>>;

  // urls
  private login = '/doctor/doctor-login-password';
  private facilityLogin = '/facilityuser/facilityuser-login';
  private facilityForPassUlr = '/facilityuser/facilityuser-forgot-password';
  private facilityResPassUrl = '/facilityuser/reset-password';
  private facilityOtpVerUrl = '/facilityuser/otp-verification';
  private facilityResendUrl = '/facilityuser/otp-resend';
  private doctorRegisterUrl = '/doctor/doctor-registration';
  private doctorForPassUlr = '/doctor/doctor-forgot-password';
  private doctorResPassUrl = '/doctor/reset-password';
  private doctorOtpVerUrl = '/doctor/otp-verification';
  private doctorResendUrl = '/doctor/otp-resend';
  private doctorNPIinfoUrl = '/doctor/get-npi-information';
  private doctorDuplicateUrl = '/doctor/check-doctor-duplication';
  private cmsPageUrl = '/cmspage/get-cmspage';
  private contactUsRegisterUrl = '/contactus/contactus';
  private contactusRequestMeetingUrl = '/contactus/requestmeeting';
  private contactusJoinUsUrl = '/contactus/joindocstime';
  private faqUrl = '/faq/faq-list';
  private degreeListsUrl = '/degrees/get-degrees-list';
  private specialityListsUrl = '/speciality/get-speciality-list';
  private reasonListsUrl = '/consultaionreason/get-consultaionreason-list';
  private documentTypeUrl = '/documenttype/get-documenttype-list';
  private insuranceListUrl = '/insurance/get-insurance-list';
  private doctorListUrl = '/doctor/doctor-list';
  private doctorAddAddressUrl = '/doctoraddress/add-address';
  private facilityJoinUrl = '/facility/facility-join';

  // Behavior Subject
  updateNav: string;
  update: BehaviorSubject<string>;
  // update noti-count
  updateCount: string;
  updateNotiAndReferralCount: BehaviorSubject<string>;
  // update date-time
  updateDateTime: string;
  updateDateTimeSchedule: BehaviorSubject<string>;
  // update notification while on page
  updateNotification: string;
  updateNotificationOnPage: BehaviorSubject<string>;
  // update doctor lists
  updateList = false;
  updateDoctors: BehaviorSubject<boolean>;
  // candidate Subject
  isNav: string;
  updateNavbar: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.update = new BehaviorSubject(this.updateNav);
    this.updateDoctors = new BehaviorSubject(this.updateList);
    this.updateNotiAndReferralCount = new BehaviorSubject(this.updateCount);
    this.updateNotificationOnPage = new BehaviorSubject(this.updateNotification);
    this.updateDateTimeSchedule = new BehaviorSubject(this.updateDateTime);
    this.updateNavbar = new BehaviorSubject(this.isNav);
  }
  httpOptions = {
    headers: new HttpHeaders({})
  };
  nextCount = (update: string) => {
    this.update.next(update);
  }
  nextCountNotificationAndReferral = (update: string) => {
    this.updateNotiAndReferralCount.next(update);
  }
  refreshNotificationWhileOnPage = (update: string) => {
    this.updateNotificationOnPage.next(update);
  }
  refreshDateTime = (update: string) => {
    this.updateDateTimeSchedule.next(update);
  }
  updateHeader = (update: string) => {
    this.updateNavbar.next(update);
  }
  updateDoctorLists = (update: boolean) => {
    this.updateDoctors.next(update);
  }
  // local storage related data
  getDocSession = () => {
    return JSON.parse(sessionStorage.getItem('doc'));
  }
  getDocLocal = () => {
    return JSON.parse(localStorage.getItem('doc'));
  }
  removeSession = () => {
    sessionStorage.removeItem('doc');
  }
  removeLocal = () => {
    localStorage.removeItem('doc');
  }
  setDocLocal = (data: string) => {
    localStorage.setItem('doc', data);
  }
  setDocSession = (data: string) => {
    sessionStorage.setItem('doc', data);
  }
  // local storage related data facility
  getFaSession = () => {
    return JSON.parse(sessionStorage.getItem('fac'));
  }
  getFaLocal = () => {
    return JSON.parse(localStorage.getItem('fac'));
  }
  removeFaSession = () => {
    sessionStorage.removeItem('fac');
  }
  removeFaLocal = () => {
    localStorage.removeItem('fac');
  }
  setFaLocal = (data: string) => {
    localStorage.setItem('fac', data);
  }
  setFaSession = (data: string) => {
    sessionStorage.setItem('fac', data);
  }

  signIn(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
    "languageID": "${JSON.parse(item).languageID}",
    "doctorPassword": "${JSON.parse(item).doctorPassword}",
    "doctorMobile": "${JSON.parse(item).doctorMobile}",
    "doctorDeviceID": "token",
    "apiType": "Android",
    "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.login, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  getNPIinfo(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID":"${JSON.parse(item).loginuserID}",
      "languageID":"${JSON.parse(item).languageID}",
      "facilityID":"${JSON.parse(item).facilityID}",
      "npiNumber":"${JSON.parse(item).npiNumber}",
      "apiType":"Android",
      "apiVersion":"1.0"
      }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.doctorNPIinfoUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  doctorRegistration(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "${JSON.parse(item).languageID}",
      "doctorNPI": "${JSON.parse(item).doctorNPI}",
      "doctorFullName": "${JSON.parse(item).doctorFullName}",
      "doctorFirstName": "${JSON.parse(item).doctorFirstName}",
      "doctorLastName": "${JSON.parse(item).doctorLastName}",
      "doctorEmail": "${JSON.parse(item).doctorEmail}",
      "doctorGender": "${JSON.parse(item).doctorGender}",
      "doctorMobile": "${JSON.parse(item).doctorMobile}",
      "doctorPassword": "${JSON.parse(item).doctorPassword}",
      "doctorFax": "${JSON.parse(item).doctorFax}",
      "facilityID": "${JSON.parse(item).facilityID}",
      "doctorAddress": "${JSON.parse(item).doctorAddress}",
      "doctorProfileImage": "${JSON.parse(item).doctorProfileImage}",
      "specialityIDs": "${JSON.parse(item).specialityIDs}",
      "degreeID": "${JSON.parse(item).degreeID}",
      "doctorDeviceType": "Android",
      "doctorDeviceID": "xczxcxzczxczxcxcxc",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.doctorRegisterUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  doctorForPassword(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "${JSON.parse(item).languageID}",
      "doctorEmail": "${JSON.parse(item).doctorEmail}",
      "doctorMobile": "${JSON.parse(item).doctorMobile}",
      "apiType": "web",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.doctorForPassUlr, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  doctorResPassword(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "logindoctorID": "${JSON.parse(item).logindoctorID}",
      "languageID": "${JSON.parse(item).languageID}",
      "doctorNewPassword": "${JSON.parse(item).doctorNewPassword}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.doctorResPassUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  doctorOTP(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "${JSON.parse(item).languageID}",
      "logindoctorID": "${JSON.parse(item).logindoctorID}",
      "doctorOTP": "${JSON.parse(item).doctorOTP}",
      "doctorEmailMobile":"${JSON.parse(item).doctorEmailMobile}",
      "facilityID": "${JSON.parse(item).facilityID}",
      "doctorDeviceID": "xczxcxzczxczxcxcxc",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.doctorOtpVerUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  doctorResendOTP(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "${JSON.parse(item).languageID}",
      "logindoctorID": "${JSON.parse(item).logindoctorID}",
      "doctorEmailMobile":"${JSON.parse(item).doctorEmailMobile}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.doctorResendUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  doctorDuplicate(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "logindoctorID": "${JSON.parse(item).logindoctorID}",
      "doctorEmail": "${JSON.parse(item).doctorEmail}",
      "doctorMobile": "${JSON.parse(item).doctorMobile}",
      "languageID": "${JSON.parse(item).languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.doctorDuplicateUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  doctorAddAddress(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID":"${JSON.parse(data).languageID}",
      "logindoctorID": "${JSON.parse(data).logindoctorID}",
      "docaddressAddress": "${JSON.parse(data).docaddressAddress}",
      "docaddressFaxNo": "${JSON.parse(data).docaddressFaxNo}",
      "countryName": "${JSON.parse(data).countryName}",
      "stateName": "${JSON.parse(data).stateName}",
      "cityName": "${JSON.parse(data).cityName}",
      "areaName":"${JSON.parse(data).areaName}",
      "docaddressContactNo": "${JSON.parse(data).docaddressContactNo}",
      "docaddressLatitude": "22.991681",
      "docaddressLongitude": "72.470936",
      "docaddressPincode":"${JSON.parse(data).docaddressPincode}",
      "docaddressDefault":"Yes",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.doctorAddAddressUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  facilitySignIn(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "facilityuserPassword": "${JSON.parse(item).facilityuserPassword}",
      "facilityuserEmail": "${JSON.parse(item).facilityuserEmail}",
      "languageID": "${JSON.parse(item).languageID}",
      "facilityuserDeviceID": "token",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.facilityLogin, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  facilityForPassword(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
    "languageID": "${JSON.parse(item).languageID}",
    "facilityuserEmail": "${JSON.parse(item).facilityuserEmail}",
    "facilityuserMobile": "${JSON.parse(item).facilityuserMobile}",
    "apiType":"Android",
    "apiVersion":"1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.facilityForPassUlr, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  facilityResPassword(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "facilityuserID": "${JSON.parse(item).facilityuserID}",
      "facilityNewPassword":"${JSON.parse(item).facilityNewPassword}",
      "languageID": "${JSON.parse(item).languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.facilityResPassUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  facilityOTP(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "${JSON.parse(item).languageID}",
      "facilityuserID": "${JSON.parse(item).facilityuserID}",
      "facilityuserOTP": "${JSON.parse(item).facilityuserOTP}",
      "facilityuserDeviceID": "xczxcxzczxczxcxcxc",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.facilityOtpVerUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  facilityResendOTP(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "${JSON.parse(item).languageID}",
      "facilityuserID": "${JSON.parse(item).facilityuserID}",
      "facilityuserMobile":"${JSON.parse(item).facilityuserMobile}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.facilityResendUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  facilityJoin(item: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "facilityuserID": "${JSON.parse(item).facilityuserID}",
	    "requestFacilityName": "${JSON.parse(item).requestFacilityName}",
	    "requestFacilityEmail": "${JSON.parse(item).requestFacilityEmail}",
	    "requestFacilityMobile": "${JSON.parse(item).requestFacilityMobile}",
	    "requestFacilityFax": "${JSON.parse(item).requestFacilityFax}",
	    "requestFacilityZip": "${JSON.parse(item).requestFacilityZip}",
	    "languageID": "${JSON.parse(item).languageID}",
	    "apiType": "Android",
	    "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.facilityJoinUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  get cmsAbout(): any {
    if (!this.cmsAboutUs$) {
      this.cmsAboutUs$ = this.cmsPage('aboutweb').pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.cmsAboutUs$;
  }
  get cmsContactUs(): any {
    if (!this.cmsContactUs$) {
      this.cmsContactUs$ = this.cmsPage('ContactUs').pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.cmsContactUs$;
  }
  get cmsPrivacyPolicy(): any {
    if (!this.cmsPrivacyPolicy$) {
      this.cmsPrivacyPolicy$ = this.cmsPage('Privacy').pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.cmsPrivacyPolicy$;
  }
  get cmsTermsAndConditions(): any {
    if (!this.cmsTermsAndConditions$) {
      this.cmsTermsAndConditions$ = this.cmsPage('Terms').pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.cmsTermsAndConditions$;
  }
  get homeFooterContent(): any {
    if (!this.footerContent$) {
      this.footerContent$ = this.cmsPage('webfooter').pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.footerContent$;
  }
  cmsDoctorTermsAndConditions(data: any): any {
    if (!this.cmsDoctorPrivacyPolicy$) {
      this.cmsDoctorPrivacyPolicy$ = this.cmsPage(data).pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.cmsDoctorPrivacyPolicy$;
  }
  cmsPage(cmspageCode: string): Observable<any> {
    const form = new FormData();
    const json = `[{
    "loginuserID": "1",
    "languageID": "1",
    "cmspageCode": "${cmspageCode}",
    "apiType": "Android",
    "apiVersion": "1.0"
  }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.cmsPageUrl, form, this.httpOptions)
      .pipe(map(res => res[0].data), retry(2), catchError(this.handleError));
  }
  get getFaq(): any {
    if (!this.faq$) {
      this.faq$ = this.faq().pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.faq$;
  }
  faq(): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "1",
      "apiVersion": "1.0",
      "apiType": "Android"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.faqUrl, form, this.httpOptions)
      .pipe(map(res => res[0].data),
        retry(2), catchError(this.handleError));
  }
  contactUsRegistration(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
    "languageID": "${JSON.parse(data).languageID}",
    "contactusName": "${JSON.parse(data).contactusName}",
    "contactusEmail": "${JSON.parse(data).contactusEmail}",
    "contactusMobile": "${JSON.parse(data).contactusMobile}",
    "contactusSubject": "${JSON.parse(data).contactusSubject}",
    "contactusRemarks": "Query",
    "apiType": "web",
    "apiVersion": "1.0"
  }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.contactUsRegisterUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  requestMeeting(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "1",
      "meetingName": "${JSON.parse(data).meetingName}",
      "meetingEmail": "${JSON.parse(data).meetingEmail}",
      "meetingMobile": "${JSON.parse(data).meetingMobile}",
      "meetingFax": "${JSON.parse(data).meetingFax}",
      "meetingLocation": "${JSON.parse(data).meetingLocation}",
      "meetingDate": "${JSON.parse(data).meetingDate}",
      "apiType": "web",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.contactusRequestMeetingUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  joinUS(data: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID": "1",
      "joinName": "${JSON.parse(data).joinName}",
      "joinEmail": "${JSON.parse(data).joinEmail}",
      "joinMobile": "${JSON.parse(data).joinMobile}",
      "joinMessage": "${JSON.parse(data).joinMessage}",
      "joinLocation": "${JSON.parse(data).joinLocation}",
      "joinType":"${JSON.parse(data).joinType}",
      "joinSpeciality":"${JSON.parse(data).joinSpeciality}",
      "apiType": "Iphone",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.contactusJoinUsUrl, form, this.httpOptions)
      .pipe(shareReplay(), retry(2), catchError(this.handleError));
  }
  get getSpecility(): any {
    if (!this.speciality$) {
      this.speciality$ = this.specilityList('').pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.speciality$;
  }
  specilityList(term: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID": "0",
      "languageID": "1",
      "searchWord": "${term}",
      "apiType": "Android",
      "page" : "0",
      "pagesize": "1000",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.specialityListsUrl, form, this.httpOptions)
      .pipe(map(res => res[0].data), retry(2), catchError(this.handleError));
  }
  get getDoctors(): Observable<any> {
    if (!this.doctors$) {
      this.doctors$ = this.doctorLists('').pipe(
        takeUntil(this.reload$),
        shareReplay(CACHE_SIZE));
    }
    return this.doctors$;
  }
  doctorLists(term: string): Observable<any> {
    const form = new FormData();
    const json = `[{
      "languageID":"1",
      "logindoctorID":"0",
      "facilityID": "${this.getFaLocal() ? this.getFaLocal().facilityID : this.getFaSession().facilityID}",
      "apiType":"Android",
      "apiVersion":"1.0",
      "searchWord":"${term}"
      }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.doctorListUrl, form, this.httpOptions)
      .pipe(map(res => res[0].data), retry(2), catchError(this.handleError));
  }
  get getDocumentTypeLists(): any {
    if (!this.document$) {
      this.document$ = this.documentTypeList().pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.document$;
  }
  documentTypeList(): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID": "0",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.documentTypeUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  get getReasons(): any {
    if (!this.reasonsLists$) {
      this.reasonsLists$ = this.reasonLists().pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.reasonsLists$;
  }
  reasonLists(): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID": "0",
      "languageID": "1",
      "searchWord": "",
      "apiType": "Android",
      "page" : "0",
      "pagesize": "1000",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.reasonListsUrl, form, this.httpOptions)
      .pipe(map(res => res[0].data), retry(2), catchError(this.handleError));
  }
  get getDegrees(): any {
    if (!this.degree$) {
      this.degree$ = this.degreeLists().pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.degree$;
  }
  degreeLists(): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID": "0",
      "languageID": "1",
      "searchWord": "",
      "apiType": "Android",
      "page" : "0",
      "pagesize": "500",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.degreeListsUrl, form, this.httpOptions)
      .pipe(map(res => res[0].data), retry(2), catchError(this.handleError));
  }
  get getInsuranceLists(): any {
    if (!this.insurance$) {
      this.insurance$ = this.insuranceList().pipe(
        shareReplay(CACHE_SIZE));
    }
    return this.insurance$;
  }
  insuranceList(): Observable<any> {
    const form = new FormData();
    const json = `[{
      "loginuserID": "0",
      "languageID": "1",
      "searchWord": "",
      "apiType": "Android",
      "page" : "0",
      "pagesize": "500",
      "apiVersion": "1.0"
    }]`;
    form.append('json', json);
    return this.http
      .post<any>(environment.apiBaseUrl + this.insuranceListUrl, form, this.httpOptions)
      .pipe(map(res => res[0].data), retry(2), catchError(this.handleError));
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

  forceReload = () => {
    this.reload$.next();
    this.doctors$ = null;
  }
  unSubscribe = () => {
    this.doctors$ = null;
  }

}
