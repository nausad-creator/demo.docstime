import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoctorsListingComponent } from './doctors-listing.component';

describe('DoctorsListingComponent', () => {
  let component: DoctorsListingComponent;
  let fixture: ComponentFixture<DoctorsListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
