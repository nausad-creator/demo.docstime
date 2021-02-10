import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-pop-up',
  template: `
  <div class="modal-body">
  <div class="tab-logincontent pt-0 text-center">
    <img [defaultImage]="'assets/img/tick_congratulations.png'" [lazyLoad]="'assets/img/tick_congratulations.png'" [errorImage]="'assets/img/tick_congratulations.png'" alt="Congratulations">
    <a href="#">
      <h4 class="mt-3">Congratulations!</h4>
    </a>
    <h6 class="mb-2">You are now part of DocsTime.</h6>
    <p class="mb-0" *ngIf="list[0].messageFirst" [innerHTML]="list[0].messageFirst"></p><br>
    <p class="mb-0" *ngIf="list[0].messageSecond">{{list[0].messageSecond}}</p>
  </div>
  <div class="p-3">
    <button type="button" (click)="onClose()" class="btn btn-primary btn-lg btn-block">Ok</button>
  </div>
</div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationPopUpComponent implements OnInit {
  list: any[] = [];
  constructor(
    private bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.cd.markForCheck();
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
}
