import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AlertModalComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
}
