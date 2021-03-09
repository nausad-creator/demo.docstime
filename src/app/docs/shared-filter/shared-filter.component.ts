import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  KeyValueDiffers,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';
interface Filter {
  referCaseDate: string;
  patientGender: string;
  patientName: string;
  doctorName: string;
  insuranceNames: any;
  refercaseUrgent: boolean;
  referStatus: string;
}
interface Insurance {
  insuranceName: string;
  insuranceID: string;
}
@Component({
  selector: 'app-shared-filter',
  templateUrl: './shared-filter.component.html',
  styles: [
    `.cursr{
      cursor: pointer;
    }`,

    `.ng-select.ng-select-single.custom ::ng-deep .ng-select-container {
      padding-left: 12.4px;
      font-size: 13px;
      padding-right: 5px;
      height: calc(1.5em + .75rem + 2px);
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      border: 1px solid #ced4da;
      border-radius: .25rem;
      appearance: none;
    }

    .ng-select.custom ::ng-deep .ng-select-container .ng-value-container .ng-placeholder {
      color: #495057;
    }

    .button-contactForms {
      color: #fff;
      border-color: #edeff2;
      padding: 9px 25px;
    }

    .ng-select.ng-select-single.custom ::ng-deep .ng-select-container .ng-value-container .ng-input {
      left: 0;
      padding-left: 12.4px;
      padding-right: 50px
    }

    .ng-select.custom ::ng-deep .ng-select-container .ng-value-container {
      align-items: center;
      padding-left: 0px;
    }

    .ng-select.ng-select-single.custom ::ng-deep .ng-value-container .ng-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      /* margin-left: -10px; */
    }

    .ng-select.custom ::ng-deep .ng-clear-wrapper {
      margin-top: 3px;
    }

    .inputWithIcon input [id="dob"] {
      padding-right: 40px;
    }

    .inputWithIcon {
      position: relative;
    }

    .inputWithIcon i {
      position: absolute;
      right: 0px;
      top: 3px;
      padding: 9px 7px;
    }

    input[name="patientDOB"] {
      word-spacing:-3px;
    }

    .customLabel {
      display: inline-block;
      margin-bottom: .3rem;
    }

    .customgroup {
      margin-bottom: 0.5rem;
    }
    `

  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedFilterComponent implements OnInit, DoCheck {
  differ: any;
  @Input() component: string;
  min: Date;
  maxDate = new Date();
  genders = ['Male', 'Female'];
  statusSent = [
    { label: 'Confirmed', value: 'Accepted' },
    { label: 'Unconfirmed', value: 'Pending' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Expired', value: 'Expired' }
  ];
  statusReceived = [
    { label: 'Confirmed', value: 'Accepted' },
    { label: 'Unconfirmed', value: 'Pending' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Expired', value: 'Expired' }
  ];
  detectResetCallDuplicate = false;
  referCaseForm: FormGroup;
  insuranceList$: Observable<Array<Insurance>>;
  @ViewChild('dateOfRefer', { static: true }) dateOfRefer: ElementRef;
  @Output() filter: EventEmitter<string> = new EventEmitter();
  @Output() resetFilter: EventEmitter<string> = new EventEmitter();
  constructor(
    private cd: ChangeDetectorRef,
    private service: HomeService,
    private fb: FormBuilder,
    private differs: KeyValueDiffers
  ) {
    this.referCaseForm = this.fb.group({
      referCaseDate: [null],
      patientGender: [null],
      patientName: [null],
      doctorName: [null],
      insuranceNames: [null],
      refercaseUrgent: [false],
      referStatus: [null]
    });
    // detect diff
    this.differ = this.differs.find({}).create();
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
  ngDoCheck(): any {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'component') {
          if (this.component === 'docs-previous' || this.component === 'docs-upcomming'){
            this.referCaseForm.reset();
            this.referCaseForm.get('refercaseUrgent').patchValue(false);
            this.referCaseForm.get('refercaseUrgent').updateValueAndValidity();
            this.detectResetCallDuplicate = true;
            this.cd.markForCheck();
          }
        }
      });
    }
  }
  ngOnInit(): void {
    this.insuranceList$ = this.service.getInsuranceLists;
    jQuery(() => {
      // Open
      $('#FilterHandale').on('click', () => {
        $('.filterContent').toggleClass('ShowFilter');
      });
      // close
      $('#FilterClose').on('click', () => {
        $('.filterContent').toggleClass('ShowFilter');
      });
    });
  }
  isObject = (val: any) => {
    if (val === null) { return false; }
    return ((typeof val === 'function') || (typeof val === 'object'));
  }
  onApply = (post: Filter) => {
    if (post.doctorName || post.insuranceNames || post.patientGender || post.patientName
      || post.referCaseDate || post.referStatus || post.refercaseUrgent) {
      if (post.referCaseDate && this.referCaseForm.valid) {
          post.insuranceNames = post.insuranceNames && this.isObject(post.insuranceNames) ? post.insuranceNames.label.trim() :
          post.insuranceNames && !this.isObject(post.insuranceNames) ? post.insuranceNames.trim() : '',
          this.filter.emit(JSON.stringify(post));
          this.detectResetCallDuplicate = true;
      }
      if (!post.referCaseDate) {
          post.insuranceNames = post.insuranceNames && this.isObject(post.insuranceNames) ? post.insuranceNames.label.trim() :
          post.insuranceNames && !this.isObject(post.insuranceNames) ? post.insuranceNames.trim() : '',
          this.filter.emit(JSON.stringify(post));
          this.detectResetCallDuplicate = true;
      }
    }
  }
  onResetFilter = (post: Filter) => {
    if (post.doctorName || post.insuranceNames || post.patientGender || post.patientName
      || post.referCaseDate || post.referStatus || post.refercaseUrgent) {
      this.referCaseForm.reset();
      this.referCaseForm.get('refercaseUrgent').patchValue(false);
      this.referCaseForm.get('refercaseUrgent').updateValueAndValidity();
      if (this.detectResetCallDuplicate) {
        this.resetFilter.emit();
        this.detectResetCallDuplicate = false;
      }
    }
  }
  onTypeDOB = (value: string) => {
    let input = value;
    if (/\D\/$/.test(input)) { input = input.substr(0, input.length - 3); }
    const values = input.split('/').map((v) => v.replace(/\D/g, ''));
    if (values[0]) { values[0] = this.checkValue(values[0], 12); }
    if (values[1]) { values[1] = this.checkValue(values[1], 31); }
    const output = values.map((v, i) => v.length === 2 && i < 2 ? v + ' / ' : v);
    this.dateOfRefer.nativeElement.value = output.join('').substr(0, 14);
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
      this.dateOfRefer.nativeElement.value = output.replace(/\s/g, '');
      this.referCaseForm.get('referCaseDate')
        .setValue(new Date(+output.split('/')[2], +output.split('/')[0] - 1, +output.split('/')[1]), { emitEvent: false });
      this.referCaseForm.get('referCaseDate').updateValueAndValidity({ emitEvent: false });
      this.cd.markForCheck();
    }
    if (!output) {
      this.dateOfRefer.nativeElement.value = '';
      this.referCaseForm.get('referCaseDate').patchValue('', { emitEvent: false });
      this.referCaseForm.get('referCaseDate').updateValueAndValidity({ emitEvent: false });
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
