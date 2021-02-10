import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoctorAddReferComponent } from './doctor-add-refer.component';

describe('DoctorAddReferComponent', () => {
  let component: DoctorAddReferComponent;
  let fixture: ComponentFixture<DoctorAddReferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorAddReferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorAddReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
