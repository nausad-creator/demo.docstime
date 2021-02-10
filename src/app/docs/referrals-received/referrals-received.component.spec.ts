import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReferralsReceivedComponent } from './referrals-received.component';

describe('ReferralsReceivedComponent', () => {
  let component: ReferralsReceivedComponent;
  let fixture: ComponentFixture<ReferralsReceivedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralsReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
