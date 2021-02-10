import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-fac-terms',
  templateUrl: './fac-terms.component.html',
  styleUrls: ['./fac-terms.component.css']
})
export class FacTermsComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService
    ) {}
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsTermsAndConditions;
  }
}
