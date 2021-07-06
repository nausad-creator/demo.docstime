import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedOndatetimeScheduledComponent } from './shared-ondatetime-scheduled.component';

describe('SharedOndatetimeScheduledComponent', () => {
  let component: SharedOndatetimeScheduledComponent;
  let fixture: ComponentFixture<SharedOndatetimeScheduledComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedOndatetimeScheduledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedOndatetimeScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
