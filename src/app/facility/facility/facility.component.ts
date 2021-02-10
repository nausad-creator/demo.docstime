import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onActivate = () => {
    window.scroll(0, 0);
  }

}
