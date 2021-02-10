import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacPrivacyDoctorComponent } from './fac-privacy-doctor.component';

describe('FacPrivacyDoctorComponent', () => {
  let component: FacPrivacyDoctorComponent;
  let fixture: ComponentFixture<FacPrivacyDoctorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacPrivacyDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacPrivacyDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
