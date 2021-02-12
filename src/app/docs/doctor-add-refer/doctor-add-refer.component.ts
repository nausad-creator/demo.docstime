import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable, concat, of } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { HomeService } from 'src/app/home.service';
import { DocsService } from '../docs.service';
import { Location } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Component({
  selector: 'app-doctor-add-refer',
  templateUrl: './doctor-add-refer.component.html',
  styleUrls: ['./doctor-add-refer.component.css']
})
export class DoctorAddReferComponent implements OnInit {
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
  specialityList$: Observable<Array<any>>;
  insuranceList$: Observable<Array<any>>;
  reasonsList$: Observable<Array<any>>;
  @ViewChild('dateOfBirth', { static: true }) dateOfBirth: ElementRef;
  @ViewChild('visitDate', { static: true }) visitDate: ElementRef;
  constructor(
    private docService: DocsService,
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
      patientFirstName: ['', Validators.compose([Validators.maxLength(60), Validators.minLength(3), Validators.required])],
      patientDOB: ['', Validators.compose([Validators.required])],
      patientCountryCode: ['+1'],
      patientMobile: [null, Validators.compose([
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')
      ])],
      patientGender: [null, Validators.compose([Validators.required])],
      facilityID: ['0'],
      specialityID: [null, Validators.compose([Validators.required])],
      insuranceName: [null, Validators.compose([])],
      reasonID: ['0'],
      reasonIDs: ['', Validators.compose([Validators.required])],
      reasonNames: [''],
      refercaseUrgent: [false],
      refercaseNPI: [null, Validators.compose([Validators.pattern('^[0-9]{10}$')])],
      refercaseDescription: [''],
      refercaseVisitDate: [''],
      refercaseVisitTime: [''],
      doctorID: [''],
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
        { id: 97, animated: false, ignoreBackdropClick: true, keyboard: false, class: 'modal-sm modal-dialog-centered' }
      ) : '');
    this.referCaseForm.get('specialityID').valueChanges.pipe()
      .subscribe((val) => {
        if (val.length > 1) {
          this.isNPI = false;
        }
        if (val.length === 1) {
          this.referCaseForm.get('refercaseNPI').patchValue('', { emitEvent: false });
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
      this.referCaseForm.get('refercaseNPI').patchValue('', { emitEvent: false });
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
  onClickBack = () => {
    this.location.back();
  }
  trackByFn = (item: any) => {
    return item.specialityID;
  }
  isObject = (val: any) => {
    if (val === null) { return false; }
    return ((typeof val === 'function') || (typeof val === 'object'));
  }
  // refer form submit
  onSubmitRefer = async (post: any) => {
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
        facilityID: post.facilityID,
        specialityID: this.referCaseForm.get('specialityID').value.length > 0 ?
          this.specialIDconvert(this.referCaseForm.get('specialityID').value) : '',
        reasonID: post.reasonIDs.length > 0 ? this.reasonsConvertStrint(post.reasonIDs).trim() : '',
        reasonIDs: '0',
        insuranceNames: post.insuranceName && this.isObject(post.insuranceName) ? post.insuranceName.label.trim() :
          post.insuranceName && !this.isObject(post.insuranceName) ? post.insuranceName.trim() : '',
        reasonNames: post.reasonIDs.length > 0 ? this.reasonsConvertNameStrint(post.reasonIDs).trim() : '',
        refercaseVisitDate: post.refercaseVisitDate ? moment(post.refercaseVisitDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : '',
        refercaseVisitTime: post.refercaseVisitTime ? moment(post.refercaseVisitTime, 'h:mm:ss A').format('HH:mm:ss') : '',
        doctorID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID,
        refercaseHospitalAdmission: post.refercaseHospitalAdmission ? 'Yes' : 'No',
        refercaseUrgent: post.refercaseUrgent ? 'Yes' : 'No',
        refercaseDescription: post.refercaseDescription ? post.refercaseDescription : '',
        refercaseNPI: post.refercaseNPI ? post.refercaseNPI : '',
        documents: this.documents.length > 0 ? this.documents.map((document) => ({
          documenttypeID: document.documenttypeID,
          documentFilename: document.documentFilename
        })) : ''
      };
      this.docService.addRefer(JSON.stringify(data)).subscribe((response) => {
        if (response[0].status === 'true') {
          this.documentTypeList.forEach(doc => doc.file = []);
          this.documentTypeList.forEach((doc) => doc.checked = false);
          this.docService.forceReloadSentList();
          setTimeout(() => {
            this.referCaseForm.reset();
            this.spinner.hide();
            this.toastr.success('Your Refer Created successfully.');
            this.router.navigate([`${'/doctor/referrals-sent'}`]);
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
        logindoctorID: this.service.getDocLocal() ? this.service.getDocLocal().doctorID : this.service.getDocSession().doctorID
      };
      this.docService.uploadFile(data).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response);
        } else {
          reject('Error Occured');
        }
      }, error => reject(error));
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
      this.referCaseForm.get('patientDOB')
        .setValue(new Date(+output.split('/')[2], +output.split('/')[0] - 1, +output.split('/')[1]), { emitEvent: false });
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
      this.referCaseForm.get('refercaseVisitDate')
        .setValue(new Date(+output.split('/')[2], +output.split('/')[0] - 1, +output.split('/')[1]), { emitEvent: false });
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
