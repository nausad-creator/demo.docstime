import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOrExistingDoctorModalComponent } from './add-or-existing-doctor-modal.component';

describe('AddOrExistingDoctorModalComponent', () => {
  let component: AddOrExistingDoctorModalComponent;
  let fixture: ComponentFixture<AddOrExistingDoctorModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrExistingDoctorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrExistingDoctorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
