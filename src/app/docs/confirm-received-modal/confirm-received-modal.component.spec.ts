import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmReceivedModalComponent } from './confirm-received-modal.component';

describe('ConfirmReceivedModalComponent', () => {
  let component: ConfirmReceivedModalComponent;
  let fixture: ComponentFixture<ConfirmReceivedModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmReceivedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmReceivedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
