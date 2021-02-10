import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityForgetPasswordComponent } from './facility-forget-password.component';

describe('FacilityForgetPasswordComponent', () => {
  let component: FacilityForgetPasswordComponent;
  let fixture: ComponentFixture<FacilityForgetPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityForgetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityForgetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
