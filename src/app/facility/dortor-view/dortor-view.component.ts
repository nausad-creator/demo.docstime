import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dortor-view',
  templateUrl: './dortor-view.component.html',
  styleUrls: ['./dortor-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DortorViewComponent implements OnInit {
  list: any[] = [];
  defaultmyImgUrl = 'assets/img/user-icon.png';
  imageUrl: string;
  modalRef: BsModalRef;
  detailsForm: FormGroup;
  baseUrl = `${environment.apiBaseUrl}/backend/web/uploads`;
  countryCodeOptions = [
    { code: '+91', flag: 'assets/img/flag_india_1.png' },
    { code: '+129', flag: 'assets/img/flag_uae_1.png' },
    { code: '+65', flag: 'assets/img/flag_usa_1.png' }
  ];
  flag = 'assets/img/flag_india_1.png'; // default
  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // for view
    this.detailsForm = this.fb.group({
      doctorEmail: [this.list[0].doctorEmail ? this.list[0].doctorEmail : ''],
      doctorFullName: [this.list[0].doctorFullName ? this.list[0].doctorFullName.substr(0, 3) === 'DR.' ?
      this.toTitleCase(this.list[0].doctorFullName) : 'Dr. ' + this.toTitleCase(this.list[0].doctorFullName) : ''],
      doctorFirstName: [this.list[0].doctorFirstName ? this.list[0].doctorFirstName : ''],
      doctorLastName: [this.list[0].doctorLastName ? this.list[0].doctorLastName : ''],
      doctorGender: [this.list[0].doctorGender ? this.list[0].doctorGender : ''],
      doctorMobile: [this.list[0].doctorMobile ? this.list[0].doctorMobile : ''],
      doctorProfileImage: [this.list[0].doctorProfileImage ? this.list[0].doctorProfileImage : ''],
      doctorNPI: [this.list[0].doctorNPI ? this.list[0].doctorNPI : ''],
      doctorFax: [this.list[0].doctorFax ? this.list[0].doctorFax : ''],
      doctorAddress: [this.list[0].doctorAddress ? this.list[0].doctorAddress : ''],
      specialityName: [this.list[0].specialityName ? this.list[0].specialityName : ''],
      degreeName: [this.list[0].degreeName ? this.list[0].degreeName : ''],
      facilityName: [this.list[0].facilityName ? this.list[0].facilityName : ''],
      userCountryCode: [{ value: this.countryCodeOptions[0].code, disabled: true }],
    });
    this.imageUrl = `${this.baseUrl}/doctor/${this.detailsForm.get('doctorProfileImage').value}`;
    this.cd.markForCheck();
  }
  toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
  onChangeCode = (code: string) => {
    this.flag = this.countryCodeOptions.filter((data) => data.code === code)[0].flag;
  }
}
