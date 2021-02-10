import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-fac-about-us',
  templateUrl: './fac-about-us.component.html',
  styleUrls: ['./fac-about-us.component.css']
})
export class FacAboutUsComponent implements OnInit {
  footerOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    nav: false,
    merge: true,
    autoplay: true, // Set AutoPlay to 3 seconds
    dots: true,
    items: 1,
    responsive: {
      0: {
        items: 1
      },
      574: {
        items: 1
      },
      767: {
        items: 1
      },
      993: {
        items: 1
      }
    }
  };
  innerHTML$: Observable<Array<any>>;
  constructor(
    public service: HomeService
  ) { }
  ngOnInit(): void {
    this.innerHTML$ = this.service.cmsAbout;
  }
}
