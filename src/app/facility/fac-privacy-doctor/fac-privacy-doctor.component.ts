import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-fac-privacy-doctor',
  templateUrl: './fac-privacy-doctor.component.html',
  styleUrls: ['./fac-privacy-doctor.component.css']
})
export class FacPrivacyDoctorComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    private service: HomeService
  ) { }
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsPrivacyPolicy;
  }
}
