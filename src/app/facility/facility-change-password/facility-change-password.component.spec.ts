import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityChangePasswordComponent } from './facility-change-password.component';

describe('FacilityChangePasswordComponent', () => {
  let component: FacilityChangePasswordComponent;
  let fixture: ComponentFixture<FacilityChangePasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
