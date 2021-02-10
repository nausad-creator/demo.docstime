import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityNavComponent } from './facility-nav.component';

describe('FacilityNavComponent', () => {
  let component: FacilityNavComponent;
  let fixture: ComponentFixture<FacilityNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
