import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReferralsSentComponent } from './referrals-sent.component';

describe('ReferralsSentComponent', () => {
  let component: ReferralsSentComponent;
  let fixture: ComponentFixture<ReferralsSentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralsSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
