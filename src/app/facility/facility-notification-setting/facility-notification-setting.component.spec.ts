import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityNotificationSettingComponent } from './facility-notification-setting.component';

describe('FacilityNotificationSettingComponent', () => {
  let component: FacilityNotificationSettingComponent;
  let fixture: ComponentFixture<FacilityNotificationSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityNotificationSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityNotificationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
