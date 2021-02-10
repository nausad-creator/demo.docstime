import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityOtpVerificationComponent } from './facility-otp-verification.component';

describe('FacilityOtpVerificationComponent', () => {
  let component: FacilityOtpVerificationComponent;
  let fixture: ComponentFixture<FacilityOtpVerificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityOtpVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityOtpVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
