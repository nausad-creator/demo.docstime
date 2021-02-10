import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedNotificationComponent } from './shared-notification.component';

describe('SharedNotificationComponent', () => {
  let component: SharedNotificationComponent;
  let fixture: ComponentFixture<SharedNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
