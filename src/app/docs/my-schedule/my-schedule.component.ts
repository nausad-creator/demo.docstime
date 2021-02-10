import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyScheduleComponent implements OnInit {
  constructor() {}
 ngOnInit(): void {
  }
}
