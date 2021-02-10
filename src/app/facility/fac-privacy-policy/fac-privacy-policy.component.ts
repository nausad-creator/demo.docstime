import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-fac-privacy-policy',
  templateUrl: './fac-privacy-policy.component.html',
  styleUrls: ['./fac-privacy-policy.component.css']
})
export class FacPrivacyPolicyComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    private service: HomeService
  ) { }
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsPrivacyPolicy;
  }
}
