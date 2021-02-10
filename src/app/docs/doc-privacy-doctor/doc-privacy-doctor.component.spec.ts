import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocPrivacyDoctorComponent } from './doc-privacy-doctor.component';

describe('DocPrivacyDoctorComponent', () => {
  let component: DocPrivacyDoctorComponent;
  let fixture: ComponentFixture<DocPrivacyDoctorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocPrivacyDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocPrivacyDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
