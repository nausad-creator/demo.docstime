import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacTermsComponent } from './fac-terms.component';

describe('FacTermsComponent', () => {
  let component: FacTermsComponent;
  let fixture: ComponentFixture<FacTermsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
