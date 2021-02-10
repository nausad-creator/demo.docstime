import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityLoginSignupComponent } from './facility-login-signup.component';

describe('FacilityLoginSignupComponent', () => {
  let component: FacilityLoginSignupComponent;
  let fixture: ComponentFixture<FacilityLoginSignupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityLoginSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityLoginSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
