import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddReferFormComponent } from './add-refer-form.component';

describe('AddReferFormComponent', () => {
  let component: AddReferFormComponent;
  let fixture: ComponentFixture<AddReferFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReferFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
