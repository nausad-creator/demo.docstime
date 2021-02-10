import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-doc-privacy-policy',
  templateUrl: './doc-privacy-policy.component.html',
  styleUrls: ['./doc-privacy-policy.component.css']
})
export class DocPrivacyPolicyComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService) {}
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsPrivacyPolicy;
  }
}
