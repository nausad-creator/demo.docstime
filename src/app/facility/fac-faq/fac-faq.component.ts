import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-fac-faq',
  templateUrl: './fac-faq.component.html',
  styleUrls: ['./fac-faq.component.css']
})
export class FacFaqComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService) {}
  ngOnInit(): void {
    this.innerHTML$ = this.service.getFaq;
  }
}
