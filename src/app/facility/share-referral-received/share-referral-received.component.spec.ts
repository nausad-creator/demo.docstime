import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareReferralReceivedComponent } from './share-referral-received.component';

describe('ShareReferralReceivedComponent', () => {
  let component: ShareReferralReceivedComponent;
  let fixture: ComponentFixture<ShareReferralReceivedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareReferralReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareReferralReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
