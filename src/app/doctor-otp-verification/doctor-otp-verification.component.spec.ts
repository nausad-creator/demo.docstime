import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoctorOtpVerificationComponent } from './doctor-otp-verification.component';

describe('DoctorOtpVerificationComponent', () => {
  let component: DoctorOtpVerificationComponent;
  let fixture: ComponentFixture<DoctorOtpVerificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorOtpVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorOtpVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
