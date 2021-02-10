import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityDashboardComponent } from './facility-dashboard.component';

describe('FacilityDashboardComponent', () => {
  let component: FacilityDashboardComponent;
  let fixture: ComponentFixture<FacilityDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
