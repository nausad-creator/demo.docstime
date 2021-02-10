import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoctorForgetPasswordComponent } from './doctor-forget-password.component';

describe('DoctorForgetPasswordComponent', () => {
  let component: DoctorForgetPasswordComponent;
  let fixture: ComponentFixture<DoctorForgetPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorForgetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorForgetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
