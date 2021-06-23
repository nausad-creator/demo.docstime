import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable, concat, of, Subscription } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';
import { Location } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { Store } from '../store.service';
import { Doctors, Documents, FileUpload, Reasons, Refer, Speciality, Upload } from '../docs.interface';
import { Files } from 'src/app/docs/docs.interface';
import { environment } from 'src/environments/environment';
interface Doctor {
  doctorAddress: string;
  doctorFirstName: string;
  doctorFullName: string;
  doctorID: string;
  doctorLastName: string;
  doctorNPI: string;
}
@Component({
  selector: 'app-my-scheduled-re-refer',
  templateUrl: './my-scheduled-re-refer.component.html',
  styleUrls: ['./my-scheduled-re-refer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyScheduledReReferComponent implements OnInit, OnDestroy {
  genders = ['Male', 'Female'];
  peopleLoading = false;
  loadingDoctors = false;
  loading = false;
  isNPI = true;
  documents = [];
  documentTypeList = [];
  selectedTypes = [];
  minTime: Date;
  min: Date;
  startAt: Date;
  isReffered = 'No';
  maxDate = new Date();
  referCaseForm: FormGroup;
  peopleInput$ = new Subject<string>();
  doctorInputNPI$ = new Subject<string>();
  doctorInput$ = new Subject<string>();
  docuTypeList$: Observable<Array<any>>;
  doctorList$: Observable<Array<any>>;
  specialityList$: Observable<Array<any>>;
  insuranceList$: Observable<Array<any>>;
  reasonsList$: Observable<Array<any>>;
  doctorListNPI$: Observable<Array<Doctors>>;
  @ViewChild('dateOfBirth', { static: true }) dateOfBirth: ElementRef;
  @ViewChild('visitDate', { static: true }) visitDate: ElementRef;
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  subs5: Subscription;
  subs6: Subscription;
  subs7: Subscription;
  subs8: Subscription;
  subs9: Subscription;
  subs10: Subscription;
  constructor(
    private facilityService: FacilityService,
    private service: HomeService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private location: Location,
    private modalService: BsModalService,
    private store: Store
  ) {
    // for disabling previous dates from current date
    let month: any;
    let day: any;
    const dtToday = new Date();
    let hour = dtToday.getHours();
    const minutes = dtToday.getMinutes();
    const seconds = dtToday.getSeconds();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    const year = dtToday.getFullYear();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    if (minutes >= 45) {
      hour++;
    }
    this.min = new Date(year, month - 1, day);
    this.startAt = new Date
      (
        year, month - 1, day, hour,
        minutes >= 0 && minutes < 15 ? 15 :
          minutes >= 15 && minutes < 30 ? 30 :
            minutes >= 30 && minutes < 45 ? 45 :
              minutes >= 45 ? 0 : 15, seconds
      );
  }
  ngOnDestroy(): void {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
    if (this.subs3) {
      this.subs3.unsubscribe();
    }
    if (this.subs4) {
      this.subs4.unsubscribe();
    }
    if (this.subs5) {
      this.subs5.unsubscribe();
    }
    if (this.subs6) {
      this.subs6.unsubscribe();
    }
    if (this.subs7) {
      this.subs7.unsubscribe();
    }
    if (this.subs8) {
      this.subs8.unsubscribe();
    }
    if (this.subs9) {
      this.subs9.unsubscribe();
    }
    if (this.subs10) {
      this.subs10.unsubscribe();
    }
  }
  async ngOnInit(): Promise<void> {
    // form initial value
    this.referCaseForm = this.fb.group({
      patientEmail: [JSON.parse(this.store.reRefer).patientEmail ? JSON.parse(this.store.reRefer).patientEmail : '', Validators.compose([Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.required])],
      doctorFullName: [JSON.parse(this.store.reRefer).doctorFullName ? {
        doctorFullName: JSON.parse(this.store.reRefer).doctorFullName,
        doctorID: JSON.parse(this.store.reRefer).doctorID
      } : null, Validators.compose([Validators.required])],
      patientFirstName: [JSON.parse(this.store.reRefer).patientFirstName ? JSON.parse(this.store.reRefer).patientFirstName : '', Validators.compose([Validators.maxLength(60), Validators.minLength(3), Validators.required])],
      patientDOB: [JSON.parse(this.store.reRefer).patientDOB ? moment(`${JSON.parse(this.store.reRefer).patientDOB}`).toDate() : '', Validators.compose([Validators.required])],
      patientCountryCode: ['+1'],
      patientMobile: [JSON.parse(this.store.reRefer).patientMobile ? this.formatMobileNumber(JSON.parse(this.store.reRefer).patientMobile) : '', Validators.compose([Validators.required, this.customValidatorUSnumber])],
      patientGender: [JSON.parse(this.store.reRefer).patientGender ? JSON.parse(this.store.reRefer).patientGender : null, Validators.compose([Validators.required])],
      facilityID: [''],
      specialityID: [null, Validators.compose([Validators.required])],
      insuranceNames: [JSON.parse(this.store.reRefer).insuranceNames ? JSON.parse(this.store.reRefer).insuranceNames : null, Validators.compose([])],
      reasonID: ['0'],
      reasonIDs: ['', Validators.compose([Validators.required])],
      reasonNames: [''],
      refercaseUrgent: [false],
      refercaseNPI: [null],
      refercaseDescription: [''],
      refercaseVisitDate: [''],
      refercaseVisitTime: [''],
      doctorID: ['0'],
      refercaseHospitalAdmission: [false]
    });
    this.reasonsList$ = this.service.getReasons;
    this.insuranceList$ = this.service.getInsuranceLists;
    this.docuTypeList$ = this.service.getDocumentTypeLists;
    this.getSpeciality();
    this.getDoctorLists();
    this.getDoctorListsNPI();
    setTimeout(() => {this.doctorInput$.next(JSON.parse(this.store.reRefer).doctorFullName ? JSON.parse(this.store.reRefer).doctorFullName : ''); });
    this.subs1 = this.docuTypeList$.subscribe((response) => {
        if (response[0].status === 'true') {
          this.documentTypeList = response[0].data;
          this.documentTypeList.forEach((doc) => doc.file = []);
          this.documentTypeList.forEach((doc) => doc.checked = false);
          this.documentTypeList.sort((a, b) => a.documenttypeID - b.documenttypeID);
          if (JSON.parse(this.store.reRefer).documents.length > 0){
            JSON.parse(this.store.reRefer).documents.forEach((d: Files) => {
              this.documentTypeList.forEach(docs => {
                if (docs.documenttypeID === d.documenttypeID) {
                  const data = { documenttypeID : d.documenttypeID, documentFilename: d.documentFilename, src: `${environment.fileUrl}/doctor/${d.documentFilename}` as string };
                  docs.file.push(data);
                  this.documents.push(data);
                  this.cd.markForCheck();
                }
              });
            });
          }
        } else { console.error(response[0].message); }
      }, errror => console.error(errror));
    this.subs2 = this.referCaseForm.get('refercaseVisitTime').valueChanges.pipe().subscribe(() => { this.check(); });
    this.subs3 = this.referCaseForm.get('refercaseVisitDate').valueChanges.pipe().subscribe(() => { this.timeAndDate(); });
    this.subs4 = this.referCaseForm.get('refercaseHospitalAdmission').valueChanges.pipe().subscribe((val) => val ? this.modalService.show(AlertModalComponent, { id: 93, animated: false, ignoreBackdropClick: true, keyboard: false, class: 'modal-sm modal-dialog-centered' }) : '');
    this.subs5 = this.referCaseForm.get('specialityID').valueChanges.pipe().subscribe((val) => {
        if (val) {
          if (val.length > 1) {
            this.isNPI = false;
          }
          if (val.length === 1) {
            this.referCaseForm.get('refercaseNPI').patchValue(null, { emitEvent: false });
            this.isNPI = true;
          }
        }
      });
    this.isReffered = JSON.parse(this.store.reRefer).refercaseReRefferred;
    this.subs9 = this.referCaseForm.get('patientMobile').valueChanges.pipe().subscribe(() => { if (this.referCaseForm.get('patientMobile').value && !this.referCaseForm.get('patientMobile').errors) {this.mobile(); }});
    this.cd.markForCheck();
  }
  mobile = () => {
    const data = {
      mobile: this.referCaseForm.get('patientMobile').value.match(/\d/g).join(''),
      languageID: '1'
    };
    this.subs8 = this.facilityService.validateNumber(JSON.stringify(data)).subscribe((r: { status: string; }) => {
      try {
        if (r.status === 'true') {
          // valid number
          this.referCaseForm.get('patientMobile').setErrors(null, {emitEvent: false});
          this.cd.markForCheck();
        }
      } catch (err) {
        this.referCaseForm.get('patientMobile').setErrors({ errPhone: true }, {emitEvent: false});
        this.cd.markForCheck();
      }
    }, () => {
      this.referCaseForm.get('patientMobile').setErrors({ errPhone: true }, {emitEvent: false});
      this.cd.markForCheck();
    });
  }
  customValidatorUSnumber(control: AbstractControl): ValidationErrors {
    const error = {
      name: '',
      message: ''
    };
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (control.value !== '') {
      if (!phoneRegex.test(control.value)) {
        error.name = 'invalidPhone';
        error.message = 'Mobile number must be only 10 digit.';
        return error;
      }
      return null;
    }
    return null;
  }
  formatMobileNumber = (text: string) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = match[1] ? '+1 ' : '';
      const n = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
      return n;
    }
    return text;
  }
  check = () => {
    if (this.referCaseForm.get('refercaseVisitDate').value === '') {
      this.referCaseForm.get('refercaseVisitTime').patchValue('', { emitEvent: false });
      this.referCaseForm.get('refercaseVisitTime').setErrors({ emptyDate: true });
      this.cd.markForCheck();
    } else {
      this.referCaseForm.get('refercaseVisitTime').setErrors(null);
      this.referCaseForm.get('refercaseVisitTime').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
  }
  timeAndDate = () => {
    const date1 = new Date();
    let month: any;
    let day: any;
    const dtToday = new Date();
    const year = dtToday.getFullYear();
    let hour = dtToday.getHours();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    const minutes = dtToday.getMinutes();
    const seconds = dtToday.getSeconds();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    if (minutes >= 45) {
      hour++;
    }
    const date2 = new Date(this.referCaseForm.get('refercaseVisitDate').value);
    date2.setHours(hour, minutes, 0, 0);
    date1.setHours(hour, minutes, 0, 0);
    if (date1.getTime() === date2.getTime()) {
      this.minTime = new Date();
      this.cd.markForCheck();
    } else {
      this.minTime = null;
      this.cd.markForCheck();
    }
    this.startAt = new Date
      (
        year, month - 1, day, hour,
        minutes >= 0 && minutes < 15 ? 15 :
          minutes >= 15 && minutes < 30 ? 30 :
            minutes >= 30 && minutes < 45 ? 45 :
              minutes >= 45 ? 0 : 15, seconds
      );
    this.referCaseForm.get('refercaseVisitTime').patchValue('', { emitEvent: false });
    this.referCaseForm.get('refercaseVisitTime').updateValueAndValidity({ emitEvent: false });
    this.cd.markForCheck();
  }
  getSpeciality = () => {
    this.specialityList$ = concat(
      of([]), // default items
      this.peopleInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.peopleLoading = true),
        switchMap(term => this.service.specilityList(term ? term.replace(/^\s+/g, '') : term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.peopleLoading = false)
        ))
      ));
  }
  getDoctorLists = () => {
    this.doctorList$ = concat(
      of([]), // default items
      this.doctorInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.loading = true),
        switchMap(term => this.service.doctorLists(term ? term.replace(/^\s+/g, '') : term).pipe(
          map(res => res[0].data.map((d) => {
            return {
              doctorAddress: d.doctorAddress,
              doctorFirstName: d.doctorFirstName,
              doctorFullName: `${d.doctorFullName}, ${d.degreeName}`,
              doctorID: d.doctorID,
              doctorLastName: d.doctorLastName,
              doctorNPI: d.doctorNPI,
              degreeID: d.degreeID,
              degreeName: d.degreeName,
            };
          })),
          catchError(() => of([])), // empty list on error
          tap(() => this.loading = false)
        ))
      )) as Observable<Array<Doctors>>;
  }
  getDoctorListsNPI = () => {
    this.doctorListNPI$ = concat(
      of([]), // default items
      this.doctorInputNPI$.pipe(
        distinctUntilChanged(),
        tap(() => this.loadingDoctors = true),
        switchMap(term => !isNaN(term ? +term.charAt(0) : null) ? this.onSearchByNPI(term) : this.onSearchByName(term))
      )) as Observable<Array<Doctors>>;
  }
  onSearchByNPI = (term: string) => {
    return this.service.searchDoctorsNPI(term ? term.replace(/^\s+/g, '') : term).pipe(
      map(res => res[0].data.map(npi => {
        return {
          doctorFullName: npi.doctorNPI,
          doctorNPI: npi.doctorNPI
        };
      })),
      catchError(() => of([])), // empty list on error
      tap(() => this.loadingDoctors = false)
    ) as Observable<Array<Doctors>>;
  }
  onSearchByName = (term: string) => {
    return this.service.searchDoctorsNPI(term ? term.replace(/^\s+/g, '') : term).pipe(
      map(res => res[0].data.map(npi => {
        return {
          doctorFullName: npi.doctorFullName,
          doctorNPI: npi.doctorNPI
        };
      })),
      catchError(() => of([])), // empty list on error
      tap(() => this.loadingDoctors = false)
    ) as Observable<Array<Doctors>>;
  }
  trackByFnDoctor = (item: Doctor) => {
    return item.doctorID;
  }
  trackByFnDoctorNPI = (item: Doctor) => {
    return item.doctorID;
  }
  onClickBack = () => {
    this.location.back();
  }
  onChangeHospital = ($event: boolean) => {
    if ($event) {
      this.referCaseForm.get('specialityID').patchValue(null, { emitEvent: false });
      this.referCaseForm.get('specialityID').patchValue([{
        specialityCreatedDate: '2020-11-02 06:49:34',
        specialityID: '231',
        specialityName: 'Hospitalist',
        specialityRemarks: '',
        specialityStatus: 'Active'
      }], { emitEvent: false });
      this.referCaseForm.get('specialityID').disable({ emitEvent: false });
      this.isNPI = false;
      this.referCaseForm.get('specialityID').updateValueAndValidity({ emitEvent: false });
    } else {
      this.referCaseForm.get('specialityID').patchValue(null, { emitEvent: false });
      this.referCaseForm.get('specialityID').enable({ emitEvent: false });
      this.referCaseForm.get('refercaseNPI').patchValue(null, { emitEvent: false });
      this.isNPI = true;
      this.referCaseForm.get('specialityID').updateValueAndValidity({ emitEvent: false });
    }
  }
  onChangeUrgentConsult = ($event: boolean) => {
    if ($event && !this.referCaseForm.get('refercaseVisitDate').value) {
      this.referCaseForm.get('refercaseVisitDate').setErrors({ emptyDate: true });
    } else {
      this.referCaseForm.get('refercaseVisitDate').setErrors(null);
    }
    this.cd.markForCheck();
  }
  onChangeCheckBox = (documenttypeID: string) => {
    const index = this.selectedTypes.indexOf(documenttypeID);
    if (index === -1) {
      this.selectedTypes.push(documenttypeID);
      this.documentTypeList.forEach((type) => {
        if (type.documenttypeID === documenttypeID) {
          type.checked = true;
        }
      });
      this.cd.markForCheck();
    } else {
      this.selectedTypes.splice(index, 1);
      this.documentTypeList.forEach((type) => {
        if (type.documenttypeID === documenttypeID) {
          type.checked = false;
        }
      });
      this.cd.markForCheck();
    }
  }
  trackByFn = (item: any) => {
    return item.specialityID;
  }
  isObject = (val: any) => {
    if (val === null) { return false; }
    return ((typeof val === 'function') || (typeof val === 'object'));
  }
  // for Re-Refer
  onClickReRefer = async (post: Refer) => {
    this.markFormTouched(this.referCaseForm);
    if (!post.patientDOB && post.refercaseUrgent && !post.refercaseVisitDate) {
      this.referCaseForm.get('patientDOB').setErrors({ emptyDOB: true });
      this.referCaseForm.get('refercaseVisitDate').setErrors({ emptyDate: true });
    }
    if (post.patientDOB && post.refercaseUrgent && !post.refercaseVisitDate) {
      this.referCaseForm.get('patientDOB').setErrors(null);
      this.referCaseForm.get('refercaseVisitDate').setErrors({ emptyDate: true });
    }
    if (!post.patientDOB && !post.refercaseUrgent) {
      this.referCaseForm.get('patientDOB').setErrors({ emptyDOB: true });
      this.referCaseForm.get('refercaseVisitDate').setErrors(null);
    }
    if (post.patientDOB && !post.refercaseUrgent) {
      this.referCaseForm.get('patientDOB').setErrors(null);
      this.referCaseForm.get('refercaseVisitDate').setErrors(null);
    }
    if (this.referCaseForm.valid && this.findInvalidControls().length === 0) {
      this.referCaseForm.get('patientDOB').setErrors(null);
      this.referCaseForm.get('refercaseVisitDate').setErrors(null);
      this.spinner.show();
      for (const doc of this.documents) {
        doc.documentFilename = await this.uploadFiles(doc).then((res: Upload) => res.fileName).catch(error => error);
      }
      const data = {
        languageID: '1',
        refercaseID: JSON.parse(this.store.reRefer).refercaseID,
        refercaseOrgCaseID: JSON.parse(this.store.reRefer).refercaseOrgCaseID === '0' ? JSON.parse(this.store.reRefer).refercaseID : JSON.parse(this.store.reRefer).refercaseOrgCaseID,
        facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
        specialityID: this.referCaseForm.get('specialityID').value.length > 0 ? this.specialIDconvert(this.referCaseForm.get('specialityID').value) : '',
        reasonID: post.reasonIDs.length > 0 ? this.reasonsConvertString(post.reasonIDs).trim() : '',
        reasonIDs: '0',
        insuranceNames: post.insuranceNames && this.isObject(post.insuranceNames) ? post.insuranceNames.label.trim() : post.insuranceNames && !this.isObject(post.insuranceNames) ? post.insuranceNames.trim() : '',
        reasonNames: post.reasonIDs.length > 0 ? this.reasonsConvertNameString(post.reasonIDs).trim() : '',
        refercaseVisitDate: post.refercaseVisitDate ? moment(post.refercaseVisitDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : '',
        refercaseVisitTime: post.refercaseVisitTime ? moment(post.refercaseVisitTime, 'h:mm:ss A').format('HH:mm:ss') : '',
        doctorID: post.doctorFullName.doctorID,
        refercaseHospitalAdmission: post.refercaseHospitalAdmission ? 'Yes' : 'No',
        refercaseUrgent: post.refercaseUrgent ? 'Yes' : 'No',
        refercaseDescription: post.refercaseDescription ? post.refercaseDescription : '',
        refercaseNPI: post.refercaseNPI ? post.refercaseNPI : '',
        documents: this.documents.length > 0 ? this.documents.map((document: Documents) => ({
          documenttypeID: document.documenttypeID,
          documentFilename: document.documentFilename
        })) : ''
      };
      this.subs6 = this.facilityService.addreRefer(JSON.stringify(data)).subscribe((response) => {
        if (response[0].status === 'true') {
          this.documentTypeList.forEach(doc => doc.file = []);
          this.documentTypeList.forEach((doc) => doc.checked = false);
          setTimeout(() => {
            this.referCaseForm.reset();
            this.spinner.hide();
            this.toastr.success('Your Re-Refer Created successfully.');
            this.checkWhereToNavigate();
          }, 100);
        } else {
          this.spinner.hide();
          this.toastr.error(response[0].message);
        }
      }, error => {
        this.spinner.hide();
        this.toastr.error('some error occured, please try again later');
        console.error(error);
      });
    }
  }
  checkWhereToNavigate = () => {
    const url = JSON.parse(this.store.reRefer).url;
    const reReferData = JSON.parse(this.store.reRefer);
    reReferData.refercaseReRefferred = 'Yes';
    switch (url) {
      case '/facility/facility-my-schedule/upcomming': {
        this.facilityService.forceReloadUpcomming();
        this.router.navigate(['/facility/facility-my-schedule/upcomming']);
        const data = { data: reReferData, url: '/facility/facility-my-schedule/upcomming' };
        this.store.setReferView(JSON.stringify(data));
        reReferData.url = '/facility/facility-my-schedule/upcomming';
        this.store.setRerefer(JSON.stringify(reReferData));
        break;
      }
      case '/facility/facility-my-schedule/previous': {
        this.facilityService.forceReloadPrivious();
        this.router.navigate(['/facility/facility-my-schedule/previous']);
        const data = { data: reReferData, url: '/facility/facility-my-schedule/previous' };
        this.store.setReferView(JSON.stringify(data));
        reReferData.url = '/facility/facility-my-schedule/previous';
        this.store.setRerefer(JSON.stringify(reReferData));
        break;
      }
      case '/facility/facility-my-schedule/cancelled': {
        this.facilityService.forceReloadCancel();
        this.router.navigate(['/facility/facility-my-schedule/cancelled']);
        const data = { data: reReferData, url: '/facility/facility-my-schedule/cancelled' };
        this.store.setReferView(JSON.stringify(data));
        reReferData.url = '/facility/facility-my-schedule/cancelled';
        this.store.setRerefer(JSON.stringify(reReferData));
        break;
      }
      default: {
        this.router.navigate(['/facility/facility-my-schedule']);
        const data = { data: reReferData, url: '/facility/facility-my-schedule' };
        this.store.setReferView(JSON.stringify(data));
        reReferData.url = '/facility/facility-my-schedule';
        this.store.setRerefer(JSON.stringify(reReferData));
        break;
      }
    }
  }
  reasonsConvertString = (post: Array<Reasons>) => {
    const reason = post.map((res: Reasons) => Object.keys(res).length > 1 ? res.reasonID : '0');
    return reason.toString();
  }
  reasonsConvertNameString = (post: Array<Reasons>) => {
    const reason = post.map((res: Reasons) => res.reasonName);
    return reason.toString();
  }
  specialIDconvert = (post: Array<Speciality>) => {
    const specials = post.map((spc: Speciality) => spc.specialityID);
    return specials.toString();
  }
  markFormTouched = (group: FormGroup | FormArray) => {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        control.markAsTouched();
        this.markFormTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
  findInvalidControls = () => {
    const invalid = [];
    const controls = this.referCaseForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  onSelectFile = async ($event: Event, documenttypeID: string) => {
    if (($event.target as HTMLInputElement).files.length > 0) {
      const file = await this.goThroughLoop($event, documenttypeID);
      const copyFile = [];
      copyFile.push(file);
      setTimeout(() => {
        this.documentTypeList.forEach(docs => {
          if (docs.documenttypeID === copyFile[0].documenttypeID) {
            copyFile[0].file.map((f: FileUpload) => docs.file.push(f));
            this.cd.markForCheck();
          }
        });
        this.cd.markForCheck();
      }, 100);
    }
    if (($event.target as HTMLInputElement).files.length > 50) {
      window.alert(`Images will Not Be more than 50`);
    }
  }
  goThroughLoop = ($event: Event, documenttypeID: string) => {
    return new Promise((resolve, reject) => {
      const fileArr = { documenttypeID, file: [] };
      if (($event.target as HTMLInputElement).files.length > 0) {
        for (const file of ($event.target as HTMLInputElement).files) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const data = { documenttypeID, documentFilename: file.name, src: reader.result as string, file };
            fileArr.file.push(data);
            this.documents.push(data);
          };
        }
        resolve(fileArr);
      } else {
        reject({});
      }
    });
  }
  onClose = (documenttypeID: string, fileName: string) => {
    this.documentTypeList.forEach((file) => {
      if (file.documenttypeID === documenttypeID) {
        const index = file.file.map((src: { documentFilename: string; }) => src.documentFilename).indexOf(fileName);
        file.file.splice(index, 1);
        this.cd.markForCheck();
      }
    });
    const indexInDoc = this.documents.map(doc => doc.documentFilename).indexOf(fileName);
    this.documents.splice(indexInDoc, 1);
  }
  uploadFiles = (doc: FileUpload) => {
    return new Promise((resolve, reject) => {
      if (doc.file){
        const data = {
          file: doc.file,
          fileName: doc.file.name,
          filePath: 'doctor',
          logindoctorID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID
        };
        this.subs7 = this.facilityService.uploadFile(data).subscribe((r) => {
          if (r[0].status === 'true') {
            resolve(r[0]);
          } else {
            reject('Error Occured');
          }
        }, error => reject(error));
      }
      if (!doc.file){
        resolve({fileName: doc.documentFilename});
      }
    });
  }
  onTypeDOB = (value: string) => {
    let input = value;
    if (/\D\/$/.test(input)) { input = input.substr(0, input.length - 3); }
    const values = input.split('/').map((v) => v.replace(/\D/g, ''));
    if (values[0]) { values[0] = this.checkValue(values[0], 12); }
    if (values[1]) { values[1] = this.checkValue(values[1], 31); }
    const output = values.map((v, i) => v.length === 2 && i < 2 ? v + ' / ' : v);
    this.dateOfBirth.nativeElement.value = output.join('').substr(0, 14);
  }
  onBlurDOB = (value: string) => {
    const input = value;
    const values = input.split('/').map((v) => v.replace(/\D/g, ''));
    let output = '';
    if (values.length === 3) {
      const year = values[2].length !== 4 ? +(values[2]) + 2000 : +(values[2]);
      const month = +(values[0]) - 1;
      const day = +(values[1]);
      const d = new Date(year, month, day);
      if (!isNaN(+d)) {
        document.getElementById('dob').innerText = d.toString();
        const dates = [d.getMonth() + 1, d.getDate(), d.getFullYear()];
        output = dates.map((v) => {
          v = v;
          return v.toString().length === 1 ? '0' + v : v;
        }).join(' / ');
      }
    }
    if (output) {
      this.dateOfBirth.nativeElement.value = output.replace(/\s/g, '');
      this.referCaseForm.get('patientDOB').setValue(new Date(+output.split('/')[2], +output.split('/')[0] - 1, +output.split('/')[1]), { emitEvent: false });
      this.referCaseForm.get('patientDOB').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
    if (!output) {
      this.dateOfBirth.nativeElement.value = '';
      this.referCaseForm.get('patientDOB').patchValue('', { emitEvent: false });
      this.referCaseForm.get('patientDOB').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
  }
  onTypeVisitDate = (value: string) => {
    let input = value;
    if (/\D\/$/.test(input)) { input = input.substr(0, input.length - 3); }
    const values = input.split('/').map((v) => v.replace(/\D/g, ''));
    if (values[0]) { values[0] = this.checkValue(values[0], 12); }
    if (values[1]) { values[1] = this.checkValue(values[1], 31); }
    const output = values.map((v, i) => v.length === 2 && i < 2 ? v + ' / ' : v);
    this.visitDate.nativeElement.value = output.join('').substr(0, 14);
  }
  onBlurVisitDate = (value: string) => {
    const input = value;
    const values = input.split('/').map((v) => v.replace(/\D/g, ''));
    let output = '';
    if (values.length === 3) {
      const year = values[2].length !== 4 ? +(values[2]) + new Date().getFullYear() : +(values[2]);
      const month = +(values[0]) - 1;
      const day = +(values[1]);
      const d = new Date(year, month, day);
      if (!isNaN(+d)) {
        document.getElementById('dov').innerText = d.toString();
        const dates = [d.getMonth() + 1, d.getDate(), d.getFullYear()];
        output = dates.map((v) => {
          v = v;
          return v.toString().length === 1 ? '0' + v : v;
        }).join(' / ');
      }
    }
    if (output) {
      this.visitDate.nativeElement.value = output.replace(/\s/g, '');
      this.referCaseForm.get('refercaseVisitDate').setValue(new Date(+output.split('/')[2], +output.split('/')[0] - 1, +output.split('/')[1]), { emitEvent: false });
      this.referCaseForm.get('refercaseVisitDate').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
    if (!output) {
      this.visitDate.nativeElement.value = '';
      this.referCaseForm.get('refercaseVisitDate').patchValue('', { emitEvent: false });
      this.referCaseForm.get('refercaseVisitDate').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
  }
  checkValue = (str: string, max: number) => {
    if (str.charAt(0) !== '0' || str === '00') {
      let num = +str;
      if (isNaN(num) || num <= 0 || num > max) { num = 1; }
      str = num > +(max.toString().charAt(0)) && num.toString().length === 1 ? '0' + num : num.toString();
    }
    return str;
  }
}
