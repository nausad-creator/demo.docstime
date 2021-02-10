import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedNewAppointmentComponent } from './shared-new-appointment.component';

describe('SharedNewAppointmentComponent', () => {
  let component: SharedNewAppointmentComponent;
  let fixture: ComponentFixture<SharedNewAppointmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedNewAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedNewAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
