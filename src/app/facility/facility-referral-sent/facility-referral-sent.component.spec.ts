import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityReferralSentComponent } from './facility-referral-sent.component';

describe('FacilityReferralSentComponent', () => {
  let component: FacilityReferralSentComponent;
  let fixture: ComponentFixture<FacilityReferralSentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityReferralSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityReferralSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
