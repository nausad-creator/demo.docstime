import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-docs-router-outlet',
  templateUrl: './docs-router-outlet.component.html',
  styleUrls: ['./docs-router-outlet.component.css']
})
export class DocsRouterOutletComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

  onActivate = () => {
    window.scroll(0, 0);
  }

}
