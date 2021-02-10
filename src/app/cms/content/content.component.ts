import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
  <app-header></app-header>
  <router-outlet (activate)="onActivate()"></router-outlet>
  <app-footer></app-footer>
  `,
  styles: [
  ]
})
export class ContentComponent {
  onActivate = () => {
    window.scroll(0, 0);
  }
}
