import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityMyScheduleComponent } from './facility-my-schedule.component';

describe('FacilityMyScheduleComponent', () => {
  let component: FacilityMyScheduleComponent;
  let fixture: ComponentFixture<FacilityMyScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityMyScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityMyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
