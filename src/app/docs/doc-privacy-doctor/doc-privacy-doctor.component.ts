import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-doc-privacy-doctor',
  templateUrl: './doc-privacy-doctor.component.html',
  styleUrls: ['./doc-privacy-doctor.component.css']
})
export class DocPrivacyDoctorComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    private service: HomeService
  ) { }
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsPrivacyPolicy;
  }
}
