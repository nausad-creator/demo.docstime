import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-doc-footer',
  templateUrl: './doc-footer.component.html',
  styleUrls: ['./doc-footer.component.css']
})
export class DocFooterComponent implements OnInit {
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
  constructor() {}
  ngOnInit(): void {
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
