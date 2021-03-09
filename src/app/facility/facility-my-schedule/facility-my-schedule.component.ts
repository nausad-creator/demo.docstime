import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { FacilityService } from '../facility.service';
const currentDate = new Date();
@Component({
  selector: 'app-facility-my-schedule',
  templateUrl: './facility-my-schedule.component.html',
  styleUrls: ['./facility-my-schedule.component.css'],
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
  constructor(private router: Router, private cd: ChangeDetectorRef, private service: FacilityService) { }
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
  }
  onResetFilter = () => {
    this.service.resetFilter('reset');
  }
  onChangeUpcomming = (sort: string) => {
    if (sort === 'Today') {
      this.data.startDate = moment(currentDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(currentDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'Tomorrow') {
      this.data.startDate = moment(this.addDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.addDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'Next_Week') {
      this.data.startDate = moment(this.addDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.addDays(currentDate, 7), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'Next_30_days') {
      this.data.startDate = moment(this.addDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.addDays(currentDate, 30), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
  }
  onChangePrevious = (sort: string) => {
    if (sort === 'Yesderday') {
      this.data.startDate = moment(this.substractDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.substractDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'Last_week') {
      this.data.startDate = moment(this.substractDays(currentDate, 7), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.substractDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
    }
    if (sort === 'last_30_days') {
      this.data.startDate = moment(this.substractDays(currentDate, 30), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.data.endDate = moment(this.substractDays(currentDate, 1), 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.service.sorting(JSON.stringify(this.data));
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
