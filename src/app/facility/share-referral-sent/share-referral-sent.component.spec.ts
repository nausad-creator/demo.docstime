import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareReferralSentComponent } from './share-referral-sent.component';

describe('ShareReferralSentComponent', () => {
  let component: ShareReferralSentComponent;
  let fixture: ComponentFixture<ShareReferralSentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareReferralSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareReferralSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
