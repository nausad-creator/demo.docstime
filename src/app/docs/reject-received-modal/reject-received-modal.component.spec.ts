import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RejectReceivedModalComponent } from './reject-received-modal.component';

describe('RejectReceivedModalComponent', () => {
  let component: RejectReceivedModalComponent;
  let fixture: ComponentFixture<RejectReceivedModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectReceivedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectReceivedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
