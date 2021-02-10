import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareScheduledAppointmentsComponent } from './share-scheduled-appointments.component';

describe('ShareScheduledAppointmentsComponent', () => {
  let component: ShareScheduledAppointmentsComponent;
  let fixture: ComponentFixture<ShareScheduledAppointmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareScheduledAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareScheduledAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
