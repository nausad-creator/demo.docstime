import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-doc-faq',
  templateUrl: './doc-faq.component.html',
  styleUrls: ['./doc-faq.component.css']
})
export class DocFaqComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService) {}
  ngOnInit(): void {
    this.innerHTML$ = this.service.getFaq;
  }

}
