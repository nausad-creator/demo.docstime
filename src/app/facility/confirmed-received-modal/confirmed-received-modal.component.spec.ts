import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmedReceivedModalComponent } from './confirmed-received-modal.component';

describe('ConfirmedReceivedModalComponent', () => {
  let component: ConfirmedReceivedModalComponent;
  let fixture: ComponentFixture<ConfirmedReceivedModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmedReceivedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmedReceivedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
