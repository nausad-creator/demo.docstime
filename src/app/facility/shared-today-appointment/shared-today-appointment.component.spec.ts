import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedTodayAppointmentComponent } from './shared-today-appointment.component';

describe('SharedTodayAppointmentComponent', () => {
  let component: SharedTodayAppointmentComponent;
  let fixture: ComponentFixture<SharedTodayAppointmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTodayAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTodayAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
