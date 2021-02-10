import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacilityFooterComponent } from './facility-footer.component';

describe('FacilityFooterComponent', () => {
  let component: FacilityFooterComponent;
  let fixture: ComponentFixture<FacilityFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
