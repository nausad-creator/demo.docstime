import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacilityService } from '../../facility.service';
const currentDate = new Date();
@Component({
  selector: 'app-facility-my-schedule',
  template: `<body class="dashbord-section">
  <div class="spacetop"></div>
  <section class="section-dashbord">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-8 appointment-conten order-2 order-lg-1 pt-3">
          <div class="row">
            <div class="col-sm-6">
              <ul class="nav nav-tabs custom-tabsnew border-0" id="myTab" role="tablist">
                <li class="nav-item"><a class="nav-link btn-outline-primary" id="home-tab" routerLink="upcomming"
                    routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" aria-controls="Upcoming"
                    aria-selected="true">Upcoming</a></li>
                <li class="nav-item"><a class="nav-link btn-outline-primary" id="profile-tab" routerLink="previous"
                    routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" aria-controls="profile"
                    aria-selected="false">Previous</a></li>
                <li class="nav-item"><a class="nav-link btn-outline-primary" id="cancelled-tab" routerLink="cancelled"
                    routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" aria-controls="cancelled"
                    aria-selected="false">Rejected</a></li>
              </ul>
            </div>
            <div class="col-sm-6 pt-3 pt-sm-0">
              <div class="d-flex justify-content-end align-items-center">
                <div class="sortings">
                  <div class="form-group mb-0 mr-3" *ngIf="component === 'upcomming' && isUpcmming">
                    <ng-select (change)="onChangeUpcomming(sort)" [items]="sortingUpcomming" bindLabel="value"
                      bindValue="id" appearance="outline" [searchable]="false" [clearable]="true" [(ngModel)]="sort"
                      class="custom" placeholder="Sorting">
                    </ng-select>
                  </div>
                  <div class="form-group mb-0 mr-3" *ngIf="component === 'previous' && isPrevs">
                    <ng-select (change)="onChangePrevious(sort)" [items]="sortingPrivious" bindLabel="value"
                      bindValue="id" appearance="outline" [searchable]="false" [clearable]="true" [(ngModel)]="sort"
                      class="custom" placeholder="Sorting">
                    </ng-select>
                  </div>
                  <div class="form-group mb-0 mr-3" *ngIf="component === 'cancelled' && isCancel">
                    <ng-select (change)="onChangePrevious(sort)" [items]="sortingPrivious" bindLabel="value"
                      bindValue="id" appearance="outline" [searchable]="false" [clearable]="true" [(ngModel)]="sort"
                      class="custom" placeholder="Sorting">
                    </ng-select>
                  </div>
                </div>
                <app-shared-filter [component]="component" (filter)="onAppliedFilter($event)"
                  (resetFilter)="onResetFilter()" *ngIf="(component === 'upcomming' && isUpcmming) || (component === 'previous' && isPrevs) || (component === 'cancelled' && isCancel)"></app-shared-filter>
              </div>
            </div>
          </div>
          <div class="tab-content pt-3" id="myTabContent">
            <router-outlet></router-outlet>
          </div>
        </div>

        <div class="col-xl-4 col-lg-4 uploadfile-conten order-1 order-lg-2 card" style="border-radius:0;">
          <div class=" wow zoomIn pt-3" data-wow-delay="0.2s">
            <app-share-datetimepicker [from]="'My-schedule'"></app-share-datetimepicker>
          </div>
        </div>
      </div>
    </div>
  </section>
  <br>
</body>`,
  styles: [`
  .custom-tabsnew li.nav-item a{border:0;border-radius:0;}
  .custom-tabsnew li.nav-item {border:1px solid #0097F6;margin-right:-1px;border-radius:8px;overflow:hidden;}
  .custom-tabsnew li.nav-item a.active{background-color:#0097F6;color:#fff;}
  .cursr{
      cursor: pointer;
  }
  .ng-select.ng-select-single.custom ::ng-deep .ng-select-container {
  padding-left: 12.4px;
  font-size: 13px;
  padding-right: 5px;
  height: calc(1.5em + .75rem + 2px);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  appearance: none;
  width: 135px;
  }
  .ng-select.custom ::ng-deep .ng-select-container .ng-value-container .ng-placeholder {
  color: #495057;
  }
  .ng-select.ng-select-single.custom ::ng-deep .ng-select-container .ng-value-container .ng-input {
  left: 0;
  padding-left: 12.4px;
  padding-right: 50px
  }
  .ng-select.custom ::ng-deep .ng-select-container .ng-value-container {
  align-items: center;
  padding-left: 0px;
  }
  .ng-select.ng-select-single.custom ::ng-deep .ng-value-container .ng-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  }
  .ng-select.custom ::ng-deep .ng-clear-wrapper {
  margin-top: 3px;
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityMyScheduleComponent implements OnInit {
  component: string;
  sort: string;
  isUpcmming = false;
  isPrevs = false;
  isCancel = false;
  data = {
    startDate: '',
    endDate: ''
  };
  sortingUpcomming = [
    { id: 'Today', value: 'Today' },
    { id: 'Tomorrow', value: 'Tomorrow' },
    { id: 'Next_Week', value: 'Next Week' },
    { id: 'Next_30_days', value: 'Next 30 days' }
  ];
  sortingPrivious = [
    { id: 'Yesderday', value: 'Yesderday' },
    { id: 'Last_week', value: 'Last Week' },
    { id: 'last_30_days', value: 'Last 30 days' }
  ];
  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private service: FacilityService,
    private spinner: NgxSpinnerService
    ) { }
  ngOnInit(): void {
    this.component = this.router.url ? this.router.url.split('/')[3] : '';
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.component = this.router.url ? this.router.url.split('/')[3] : '';
        this.sort = null;
        this.service.filter('');
        this.service.resetFilter('');
        this.service.sorting('');
        this.cd.markForCheck();
      }
    });
    this.service.isEmptyUpcoming.subscribe(isUpcomming => {
      this.isUpcmming = isUpcomming;
      this.cd.markForCheck();
    });
    this.service.isEmptyPrivious.subscribe(isPrevious => {
      this.isPrevs = isPrevious;
      this.cd.markForCheck();
    });
    this.service.isEmptyCancel.subscribe(isCancelled => {
      this.isCancel = isCancelled;
      this.cd.markForCheck();
    });
  }
  onAppliedFilter = (filter: string) => {
    this.service.filter(filter);
    this.spinner.show();
  }
  onResetFilter = () => {
    this.service.resetFilter('reset');
    this.spinner.show();
  }
  onChangeUpcomming = (sort: string) => {
    if (sort === 'Today') {
      this.spinner.show();
      this.data.startDate = moment(currentDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(currentDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'Tomorrow') {
      this.spinner.show();
      this.data.startDate = moment(this.addDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.addDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'Next_Week') {
      this.spinner.show();
      this.data.startDate = moment(this.addDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.addDays(currentDate, 7), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'Next_30_days') {
      this.spinner.show();
      this.data.startDate = moment(this.addDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.addDays(currentDate, 30), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === null) {
      this.spinner.show();
      this.service.resetFilter('reset');
    }
  }
  onChangePrevious = (sort: string) => {
    if (sort === 'Yesderday') {
      this.spinner.show();
      this.data.startDate = moment(this.substractDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.substractDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'Last_week') {
      this.spinner.show();
      this.data.startDate = moment(this.substractDays(currentDate, 7), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.substractDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'last_30_days') {
      this.spinner.show();
      this.data.startDate = moment(this.substractDays(currentDate, 30), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.substractDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === null) {
      this.spinner.show();
      this.service.resetFilter('reset');
    }
  }
  addDays = (date: string | number | Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  substractDays = (date: string | number | Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }
}
