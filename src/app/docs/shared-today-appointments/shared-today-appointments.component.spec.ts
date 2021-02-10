import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedTodayAppointmentsComponent } from './shared-today-appointments.component';

describe('SharedTodayAppointmentsComponent', () => {
  let component: SharedTodayAppointmentsComponent;
  let fixture: ComponentFixture<SharedTodayAppointmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTodayAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTodayAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
