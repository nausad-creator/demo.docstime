import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-shared-list-doctors',
  templateUrl: './shared-list-doctors.component.html',
  styleUrls: ['./shared-list-doctors.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedListDoctorsComponent implements OnInit {
  @Input() doctorFullName: string;
  @Input() doctorGender: string;
  @Input() doctorProfileImage: string;
  @Input() specialityName: string;
  @Input() wholeObject: any;
  @Output() view: EventEmitter<any> = new EventEmitter();
  url = '';
  preFixDRstr: string;
  baseUrl = 'https://demo.docstime.com/backend/web/uploads';
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.url = `${this.baseUrl}/doctor/${this.doctorProfileImage}`;
    this.preFixDRstr = this.doctorFullName.substr(0, 3);
    this.cd.markForCheck();
  }
  onClickView = (obj: any) => {
    this.view.emit(obj);
  }

}
