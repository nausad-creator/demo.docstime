import { Component, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alert-modal',
  template: `
   <div class="modal-dialog align-items-center h-100 m-auto" role="document">
              <div class="modal-contents">
                <div class="modal-body">
                   <h5 class="text-danger">If this is an emergengy please call <b class="text-danger">911.</b></h5>
                </div>
                 <div class="modal-footer border-0 pt-0">
                  <button type="button" (click)="onClose()" class="btn btn-primary">Ok</button>
                </div>
              </div>
            </div>
  `,
  styles: [`
  .modal-contents {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: .3rem;
  outline: 0;
}`],
  encapsulation: ViewEncapsulation.None
})
export class AlertModalComponent {
  constructor(
    private bsModalRef: BsModalRef
  ) { }
  onClose = () => {
    this.bsModalRef.hide();
  }
}
