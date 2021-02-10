import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable, concat, of } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { FacilityService } from '../facility.service';
import { Location } from '@angular/common';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DateValidatorFacility } from '../datevalidator';

@Component({
  selector: 'app-add-refer-form',
  templateUrl: './add-refer-form.component.html',
  styleUrls: ['./add-refer-form.component.css']
})
export class AddReferFormComponent implements OnInit {
  genders = ['Male', 'Female'];
  peopleLoading = false;
  loading = false;
  isNPI = true;
  documents = [];
  documentTypeList = [];
  selectedTypes = [];
  minTime: Date;
  min: Date;
  maxDate = new Date();
  referCaseForm: FormGroup;
  peopleInput$ = new Subject<string>();
  doctorInput$ = new Subject<string>();
  docuTypeList$: Observable<Array<any>>;
  doctorList$: Observable<Array<any>>;
  specialityList$: Observable<Array<any>>;
  insuranceList$: Observable<Array<any>>;
  reasonsList$: Observable<Array<any>>;
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
  ) {
    this.referCaseForm = this.fb.group({
      patientEmail: ['', Validators.compose([
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
        Validators.required
      ])],
      doctorFullName: [null, Validators.compose([Validators.required])],
      patientFirstName: ['', Validators.compose([Validators.maxLength(60), Validators.minLength(3), Validators.required])],
      patientDOB: ['', Validators.compose([Validators.required, DateValidatorFacility()])],
      patientCountryCode: ['+1'],
      patientMobile: [null, Validators.compose([
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')
      ])],
      patientGender: [null, Validators.compose([Validators.required])],
      facilityID: [''],
      specialityID: [null, Validators.compose([Validators.required])],
      insuranceName: [null, Validators.compose([])],
      reasonID: ['0'],
      reasonIDs: ['', Validators.compose([Validators.required])],
      reasonNames: [''],
      refercaseVisitDate: ['', Validators.compose([DateValidatorFacility()])],
      refercaseVisitTime: [''],
      refercaseUrgent: [false],
      refercaseNPI: [null, Validators.compose([Validators.pattern('^[0-9]{10}$')])],
      refercaseDescription: [''],
      doctorID: ['0'],
      refercaseHospitalAdmission: [false]
    });
    // for disabling previous dates from current date
    let month: any;
    let day: any;
    const dtToday = new Date();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    const year = dtToday.getFullYear();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    this.min = new Date(year, month - 1, day);
  }

  ngOnInit(): void {
    this.reasonsList$ = this.service.getReasons;
    this.insuranceList$ = this.service.getInsuranceLists;
    this.docuTypeList$ = this.service.getDocumentTypeLists;
    this.getSpeciality();
    this.getDoctorLists();
    setTimeout(() => {this.doctorInput$.next(''); });
    this.docuTypeList$.subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.documentTypeList = response[0].data;
          this.documentTypeList.forEach((doc) => doc.file = []);
          this.documentTypeList.forEach((doc) => doc.checked = false);
          this.documentTypeList.sort((a, b) => a.documenttypeID - b.documenttypeID);
        } else { console.error(response[0].message); }
      }, errror => console.error(errror));
    this.referCaseForm.get('refercaseVisitTime').valueChanges.pipe().subscribe(() => { this.check(); });
    this.referCaseForm.get('refercaseVisitDate').valueChanges.pipe().subscribe(() => {
      const date1 = new Date();
      date1.setHours(0, 0, 0, 0);
      const date2 = new Date(this.referCaseForm.get('refercaseVisitDate').value);
      if (date1.getTime() === date2.getTime()) {
        this.minTime = new Date();
      } else {
        this.minTime = null;
      }
      this.referCaseForm.get('refercaseVisitTime').patchValue('', { emitEvent: false });
      this.referCaseForm.get('refercaseVisitTime').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    });
    this.referCaseForm.get('refercaseHospitalAdmission').valueChanges.pipe()
      .subscribe((val) => val ? this.modalService.show(AlertModalComponent,
        { id: 93, animated: false, ignoreBackdropClick: true, keyboard: false, class: 'modal-sm modal-dialog-centered' }
        ) : '');
    this.referCaseForm.get('specialityID').valueChanges.pipe()
      .subscribe((val) => {
        if (val.length > 1){
          this.isNPI = false;
        }
        if (val.length === 1){
          this.referCaseForm.get('refercaseNPI').patchValue('', {emitEvent: false});
          this.isNPI = true;
        }
      });
    this.cd.markForCheck();
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
  onKey = (event: string) => {
    if (!event){
      this.referCaseForm.get('refercaseVisitDate').patchValue('', {onlySelf: true, emitEvent: false});
    }
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
          catchError(() => of([])), // empty list on error
          tap(() => this.loading = false)
        ))
      ));
  }
  trackByFnDoctor = (item: any) => {
    return item.refercaseID;
  }
  onChangeHospital = ($event: boolean) => {
    if ($event) {
      this.referCaseForm.get('specialityID').patchValue(null, {emitEvent: false});
      this.referCaseForm.get('specialityID').patchValue([{
        specialityCreatedDate: '2020-11-02 06:49:34',
        specialityID: '231',
        specialityName: 'Hospitalist',
        specialityRemarks: '',
        specialityStatus: 'Active'
      }], {emitEvent: false});
      this.referCaseForm.get('specialityID').disable({emitEvent: false});
      this.isNPI = false;
      this.referCaseForm.get('specialityID').updateValueAndValidity({emitEvent: false});
    } else {
      this.referCaseForm.get('specialityID').patchValue(null, {emitEvent: false});
      this.referCaseForm.get('specialityID').enable({emitEvent: false});
      this.referCaseForm.get('refercaseNPI').patchValue('', {emitEvent: false});
      this.isNPI = true;
      this.referCaseForm.get('specialityID').updateValueAndValidity({emitEvent: false});
    }
  }
  onChangeUrgentConsult = ($event: boolean) => {
    if ($event) {
      this.referCaseForm.get('refercaseVisitDate').setValidators([Validators.required]);
      this.referCaseForm.get('refercaseVisitDate').updateValueAndValidity({ emitEvent: false });
    } else {
      this.referCaseForm.get('refercaseVisitDate').clearValidators();
      this.referCaseForm.get('refercaseVisitDate').updateValueAndValidity({ emitEvent: false });
    }
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
  onClickBack = () => {
    this.location.back();
  }
  trackByFn = (item: any) => {
    return item.specialityID;
  }
  isObject = (val: any) => {
    if (val === null) { return false; }
    return ( (typeof val === 'function') || (typeof val === 'object') );
  }
  // refer form submit
  onSubmitRefer = async (post: any) => {
    this.markFormTouched(this.referCaseForm);
    if (!post.patientDOB){
      this.referCaseForm.get('patientDOB').setErrors({
        emptyDOB: true,
      });
    }
    if (this.referCaseForm.valid && this.findInvalidControls().length === 0) {
      this.spinner.show();
      for (const doc of this.documents) {
        doc.documentFilename = await this.uploadFiles(doc).then((res: Array<any>) => res[0].fileName).catch(error => error);
      }
      const data = {
        languageID: '1',
        patientEmail: post.patientEmail.trim(),
        patientFirstName: post.patientFirstName.trim(),
        patientDOB: moment(post.patientDOB, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        patientCountryCode: post.patientCountryCode,
        patientMobile: post.patientMobile,
        patientGender: post.patientGender,
        facilityID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID,
        specialityID: this.referCaseForm.get('specialityID').value.length > 0 ?
        this.specialIDconvert(this.referCaseForm.get('specialityID').value) : '',
        reasonID: post.reasonIDs.length > 0 ? this.reasonsConvertStrint(post.reasonIDs).trim() : '' ,
        reasonIDs: '0',
        insuranceNames: post.insuranceName && this.isObject(post.insuranceName) ? post.insuranceName.label.trim() :
        post.insuranceName && !this.isObject(post.insuranceName) ? post.insuranceName.trim() : '',
        reasonNames: post.reasonIDs.length > 0 ? this.reasonsConvertNameStrint(post.reasonIDs).trim() : '',
        refercaseVisitDate: post.refercaseVisitDate ? moment(post.refercaseVisitDate).format('YYYY-MM-DD') : '',
        refercaseVisitTime: post.refercaseVisitTime ? moment(post.refercaseVisitTime, 'h:mm:ss A').format('HH:mm:ss') : '',
        doctorID: post.doctorFullName.doctorID,
        refercaseHospitalAdmission: post.refercaseHospitalAdmission ? 'Yes' : 'No',
        refercaseUrgent: post.refercaseUrgent ? 'Yes' : 'No',
        refercaseDescription: post.refercaseDescription ? post.refercaseDescription : '',
        refercaseNPI: post.refercaseNPI ? post.refercaseNPI : '',
        documents: this.documents.length > 0 ? this.documents.map((document) => ({
           documenttypeID: document.documenttypeID,
           documentFilename: document.documentFilename
          })) : ''
      };
      this.facilityService.addRefer(JSON.stringify(data)).subscribe((response) => {
        if (response[0].status === 'true') {
          this.documentTypeList.forEach(doc => doc.file = []);
          this.documentTypeList.forEach((doc) => doc.checked = false);
          this.facilityService.forceReloadSentList();
          setTimeout(() => {
            this.referCaseForm.reset();
            this.spinner.hide();
            this.toastr.success('Your Refer Created successfully.');
            this.router.navigate([`${'/facility/facility-referral-sent'}`]);
          }, 500);
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

  reasonsConvertStrint = (post: Array<any>) => {
    const reason = post.map((res: { reasonID: string; }) => Object.keys(res).length > 1 ? res.reasonID : '0');
    return reason.toString();
  }
  reasonsConvertNameStrint = (post: Array<any>) => {
    const reason = post.map((res: { reasonName: string; }) => res.reasonName);
    return reason.toString();
  }
  specialIDconvert = (post: Array<any>) => {
    const specials = post.map((spc: { specialityID: string; }) => spc.specialityID);
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
  onSelectFile = async ($event: any, documenttypeID: string) => {
    if ($event.target.files.length > 0 && $event.target.files.length < 50) {
      const file = await this.goThroughLoop($event, documenttypeID);
      const copyFile = [];
      copyFile.push(file);
      setTimeout(() => {
        this.documentTypeList.forEach(docs => {
          if (docs.documenttypeID === copyFile[0].documenttypeID) {
            copyFile[0].file.map((f: any) => docs.file.push(f));
            this.cd.markForCheck();
          }
        });
        this.cd.markForCheck();
      }, 100);
    }
    if ($event.target.files.length > 50) {
      window.alert(`Images will Not Be more than 50`);
    }
  }
  goThroughLoop = ($event: any, documenttypeID: string) => {
    return new Promise((resolve, reject) => {
      const fileArr = { documenttypeID, file: [] };
      if ($event.target.files.length > 0) {
        for (const file of $event.target.files) {
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
  uploadFiles = (doc: any) => {
    return new Promise((resolve, reject) => {
      const data = {
        file: doc.file,
        fileName: doc.file.name,
        filePath: 'doctor',
        logindoctorID: this.service.getFaLocal() ? this.service.getFaLocal().facilityID : this.service.getFaSession().facilityID
      };
      this.facilityService.uploadFile(data).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response);
        } else {
          reject('Error Occured');
        }
      }, error => reject(error));
    });
  }
}
