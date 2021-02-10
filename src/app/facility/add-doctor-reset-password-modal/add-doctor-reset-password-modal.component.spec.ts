import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDoctorResetPasswordModalComponent } from './add-doctor-reset-password-modal.component';

describe('AddDoctorResetPasswordModalComponent', () => {
  let component: AddDoctorResetPasswordModalComponent;
  let fixture: ComponentFixture<AddDoctorResetPasswordModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDoctorResetPasswordModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDoctorResetPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
