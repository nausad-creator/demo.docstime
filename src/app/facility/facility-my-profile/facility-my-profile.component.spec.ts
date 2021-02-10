import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityMyProfileComponent } from './facility-my-profile.component';

describe('FacilityMyProfileComponent', () => {
  let component: FacilityMyProfileComponent;
  let fixture: ComponentFixture<FacilityMyProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityMyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
