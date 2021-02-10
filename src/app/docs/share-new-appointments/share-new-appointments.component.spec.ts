import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareNewAppointmentsComponent } from './share-new-appointments.component';

describe('ShareNewAppointmentsComponent', () => {
  let component: ShareNewAppointmentsComponent;
  let fixture: ComponentFixture<ShareNewAppointmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareNewAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareNewAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
