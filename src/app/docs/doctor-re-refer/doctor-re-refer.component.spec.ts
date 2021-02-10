import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DoctorReReferComponent } from './doctor-re-refer.component';

describe('DoctorReReferComponent', () => {
  let component: DoctorReReferComponent;
  let fixture: ComponentFixture<DoctorReReferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorReReferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorReReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
