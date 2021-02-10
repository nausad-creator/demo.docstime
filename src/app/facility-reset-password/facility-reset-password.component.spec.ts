import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityResetPasswordComponent } from './facility-reset-password.component';

describe('FacilityResetPasswordComponent', () => {
  let component: FacilityResetPasswordComponent;
  let fixture: ComponentFixture<FacilityResetPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
