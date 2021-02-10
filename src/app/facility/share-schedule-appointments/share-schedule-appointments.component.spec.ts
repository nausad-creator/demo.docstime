import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareScheduleAppointmentsComponent } from './share-schedule-appointments.component';

describe('ShareScheduleAppointmentsComponent', () => {
  let component: ShareScheduleAppointmentsComponent;
  let fixture: ComponentFixture<ShareScheduleAppointmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareScheduleAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareScheduleAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
