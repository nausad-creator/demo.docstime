import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacPrivacyPolicyComponent } from './fac-privacy-policy.component';

describe('FacPrivacyPolicyComponent', () => {
  let component: FacPrivacyPolicyComponent;
  let fixture: ComponentFixture<FacPrivacyPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacPrivacyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
