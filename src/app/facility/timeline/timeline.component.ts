import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-timeline',
  template: `
  <!--Timeline Modal-->
			<div class="modal-contents">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel">Timeline</h5>
					<button type="button" class="close" (click)="onClose()" aria-label="Close">
					  <span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="timelineContent" *ngIf="list[0].timeline.length > 0">
						<div class="item-timeline" *ngFor="let status of list[0].timeline">
							<div class="d-flex">
								<div class="imgtimeline"><img class="userIcon" defaultImage="{{baseUrl}}/{{status.doctorProfileImage}}"
                lazyLoad="{{baseUrl}}/{{status.doctorProfileImage}}"
                [errorImage]="'assets/img/user-icon.png'" alt="user"></div>
								<div class="timecontent">
									<h4 class="mb-0"><span>{{status.timelineStatus}}</span> <br> {{(status.doctorFullName.length>30)? (status.doctorFullName | slice:0:30)+'...':(status.doctorFullName)}}</h4>
									<p>{{(status.timelineDate | date: 'MMM d, y') + ' - ' + (status.timelineDate | date:'shortTime')}}</p>
								</div>
							</div>
						</div>
					</div>
					<br>
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
  }
  .userIcon{
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }`
  ]
})
export class TimelineComponent implements OnInit {
  list: any[] = [];
  baseUrl = `${environment.fileUrl}/doctor`;
  url: string;
  constructor(private bsModalRef: BsModalRef) { }
  onClose = () => {
    this.bsModalRef.hide();
  }
  ngOnInit(): void {
  }

}
