import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityReferralReceivedComponent } from './facility-referral-received.component';

describe('FacilityReferralReceivedComponent', () => {
  let component: FacilityReferralReceivedComponent;
  let fixture: ComponentFixture<FacilityReferralReceivedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityReferralReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityReferralReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
