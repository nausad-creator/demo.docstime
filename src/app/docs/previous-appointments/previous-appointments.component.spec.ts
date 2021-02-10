import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviousAppointmentsComponent } from './previous-appointments.component';

describe('PreviousAppointmentsComponent', () => {
  let component: PreviousAppointmentsComponent;
  let fixture: ComponentFixture<PreviousAppointmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
