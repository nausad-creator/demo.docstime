import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent implements OnInit {
  innerHTML$: Observable<Array<any>>;
  footerOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    nav: false,
    merge: true,
    autoplay: true,
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
  constructor(public service: HomeService) {}
  ngOnInit(): void {
    this.innerHTML$ = this.service.homeFooterContent;
  }
  openFBpage = () => {
    window.open('https://www.facebook.com/DocsTime-102916645040860');
  }
  openTwitterpage = () => {
    window.open('https://twitter.com/DocsTime?ref_src=twsrc%5Etfw');
  }
  openLinkedINpage = () => {
    window.open('https://www.linkedin.com/in/docs-time-313818201');
  }
}
