import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoctorViewReferComponent } from './doctor-view-refer.component';

describe('DoctorViewReferComponent', () => {
  let component: DoctorViewReferComponent;
  let fixture: ComponentFixture<DoctorViewReferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorViewReferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorViewReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
