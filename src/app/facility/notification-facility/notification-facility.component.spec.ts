import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationFacilityComponent } from './notification-facility.component';

describe('NotificationFacilityComponent', () => {
  let component: NotificationFacilityComponent;
  let fixture: ComponentFixture<NotificationFacilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
