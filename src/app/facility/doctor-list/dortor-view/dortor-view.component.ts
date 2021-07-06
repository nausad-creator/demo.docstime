import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dortor-view',
  template: `<div class="modal-contents modal">
  <!-- Modal Header -->
  <div class="modal-header">
    <h4 class="modal-title">Doctor Detail</h4>
    <button type="button" (click)="onClose()" class="close" data-dismiss="modal">&times;</button>
  </div>
  <!-- Modal body -->
  <div class="modal-body">
    <form class="bootstrap-form needs-validation" [formGroup]="detailsForm">
      <div class="form-group">
        <div class="profileupload">
          <div class="imagebox mt-0 ">
            <label class="hoverable" for="fileInput">
              <img [defaultImage]="'assets/img/user-icon.png'" [lazyLoad]="imageUrl" [errorImage]="'assets/img/user-icon.png'">
              <div class="hover-text">
              </div>
              <div class="background"></div>
            </label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="signonname" class="text-uppercase text-primary">Name<span class="required-field"></span></label>
        <input type="text" formControlName="doctorFullName" id="signonname" class="form-control" name="signonname" readonly
          value="" required />
      </div>
      <div class="form-group">
        <label for="email" class="text-uppercase text-primary">Email Address<span class="required-field"></span></label>
        <input type="email" formControlName="doctorEmail" placeholder="Enter Email" id="email" class="form-control" readonly
          name="email" />
      </div>
      <div class="form-group">
        <label for="mobile" class="text-uppercase text-primary">Mobile Number<span
            class="required-field"></span></label>
        <input type="text" id="mobile" formControlName="doctorMobile" class="form-control" name="mobile" readonly required />
      </div>
      <div class="form-group">
        <label for="Fax" class="text-uppercase text-primary">Fax Number<span class="required-field"></span></label>
        <input type="text" maxlength="10" formControlName="doctorFax" id="Fax" readonly class="form-control" name="Fax"
          placeholder="Enter Fax number" value="" required />
      </div>
      <div class="form-group">
        <label for="Gender" class="text-uppercase text-primary">Gender<span class="required-field"></span></label>
        <input type="text" formControlName="doctorGender" id="Gender" readonly class="form-control" placeholder="Enter Gender"
          name="Gender" />
      </div>
      <div class="form-group">
        <label for="Address" class="text-uppercase text-primary">Address<span class="required-field"></span></label>
        <textarea type="text" formControlName="doctorAddress" id="Address" readonly class="form-control"
          placeholder="Enter Address" name="Address" required></textarea>
      </div>
      <div class="form-group">
        <label for="Gender" class="text-uppercase text-primary">National Provider Identifier(NPI)<span
            class="required-field"></span></label>
        <input type="text" formControlName="doctorNPI" id="doctorNPI" readonly class="form-control"
          placeholder="Enter National Provider Identifier(NPI)" name="doctorNPI" />
      </div>
      <div class="form-group">
        <label for="Gender" class="text-uppercase text-primary">Speciality<span class="required-field"></span></label>
        <input type="text" formControlName="specialityName" readonly id="doctorSpecility" class="form-control"
          placeholder="Enter Speciality" name="doctorSpecility" />
      </div>
      <div class="form-group">
        <label for="Gender" class="text-uppercase text-primary">Qualification<span class="required-field"></span></label>
        <input type="text" formControlName="degreeName" readonly id="doctorDegree" class="form-control"
          placeholder="Enter Degree" name="doctorDegree" />
      </div>
      <div class="form-group">
        <label for="Gender" class="text-uppercase text-primary">Hospital<span class="required-field"></span></label>
        <input type="text" formControlName="facilityName" readonly id="doctorHospital" class="form-control"
          placeholder="Enter Hospital" name="doctorHospital" />
      </div>
      <!-- -->
    </form>
  </div>

</div>`,
  styles: [`.required-field::before {
    content: "*";
    color: red;
  }
  .mobile-withcountry .code {
    border: none;
    position: absolute;
    top: 36.5px;
    left: 3px;
  }
  .modal-contents {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: .3rem;
    outline: 0;
}`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DortorViewComponent implements OnInit {
  list: any[] = [];
  defaultmyImgUrl = 'assets/img/user-icon.png';
  imageUrl: string;
  modalRef: BsModalRef;
  detailsForm: FormGroup;
  baseUrl = `${environment.fileUrl}`;
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
