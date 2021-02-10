import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedListDoctorsComponent } from './shared-list-doctors.component';

describe('SharedListDoctorsComponent', () => {
  let component: SharedListDoctorsComponent;
  let fixture: ComponentFixture<SharedListDoctorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedListDoctorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedListDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
