import { Component } from '@angular/core';

@Component({
  selector: 'app-facility',
  template: `
  <app-facility-nav></app-facility-nav>
  <router-outlet (activate)="onActivate()"></router-outlet>
  <app-facility-footer></app-facility-footer>
  `,
  styles: []
})
export class FacilityComponent {

  onActivate = () => {
    window.scroll(0, 0);
  }

}
