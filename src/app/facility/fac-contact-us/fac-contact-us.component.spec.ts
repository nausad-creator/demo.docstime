import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacContactUsComponent } from './fac-contact-us.component';

describe('FacContactUsComponent', () => {
  let component: FacContactUsComponent;
  let fixture: ComponentFixture<FacContactUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacContactUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
