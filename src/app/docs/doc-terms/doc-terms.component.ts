import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-doc-terms',
  templateUrl: './doc-terms.component.html',
  styleUrls: ['./doc-terms.component.css']
})
export class DocTermsComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService
    ) {}
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsTermsAndConditions;
  }
}
