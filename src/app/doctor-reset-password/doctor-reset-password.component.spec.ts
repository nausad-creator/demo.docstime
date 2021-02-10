import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoctorResetPasswordComponent } from './doctor-reset-password.component';

describe('DoctorResetPasswordComponent', () => {
  let component: DoctorResetPasswordComponent;
  let fixture: ComponentFixture<DoctorResetPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
