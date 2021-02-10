import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoctorSetPasswordComponent } from './doctor-set-password.component';

describe('DoctorSetPasswordComponent', () => {
  let component: DoctorSetPasswordComponent;
  let fixture: ComponentFixture<DoctorSetPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorSetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorSetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
