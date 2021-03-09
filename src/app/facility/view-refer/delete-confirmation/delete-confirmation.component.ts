import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DocsService } from 'src/app/docs/docs.service';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-delete-confirmation',
  template: `
  <div class="modal-contents">
  <div class="modal-header">
  <h5 class="modal-title" id="exampleModalLabel">Alert</h5>
  <button type="button" class="close" data-dismiss="modal" (click)="onClose()" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  </div>
  <div class="modal-body">
  <p>Are you sure you want to delete this referral?</p>
  </div>
  <div class="modal-footer">
  <button type="button" class="btn btn-secondary" (click)="onClose()" data-dismiss="modal">No</button>
  <button type="button" (click)="deleteCase()" class="btn btn-primary">Yes</button>
  </div>
</div>
  `,
  styles: [
    `.modal-contents {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      pointer-events: auto;
      background-color: #fff;
      background-clip: padding-box;
      /* border: 1px solid rgba(0, 0, 0, .2); */
      border-radius: .3rem;
      outline: 0;
  }`
  ]
})
export class DeleteConfirmationComponent implements OnInit {
  list: any[] = [];
  public event: EventEmitter<string> = new EventEmitter();
  constructor(
    private docService: DocsService,
    private spinner: NgxSpinnerService,
    private service: HomeService,
    public toastr: ToastrService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }
  onClose = () => {
    this.bsModalRef.hide();
  }
  deleteCase = () => {
    this.spinner.show();
    this.docService.deleteCase(JSON.stringify({ refercaseID: this.list[0].refercaseID, languageID: '1' }))
      .subscribe((res) => {
        if (res[0].status === 'true') {
          this.toastr.success('Refer deleted successfully');
          this.service.nextCountNotificationAndReferral(this.list[0].refercaseID);
          this.triggerEvent(JSON.stringify({ res: 'confirmed' }));
          this.bsModalRef.hide();
        }
        if (res[0].status === 'false') {
          this.toastr.error('Error occured while deleting refer');
          console.error(res[0].message);
        }
      }, err => console.error(err), (() => this.spinner.hide()));
  }
  triggerEvent = (data: string) => {
    this.event.emit(data);
  }
}
