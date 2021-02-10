import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacFaqComponent } from './fac-faq.component';

describe('FacFaqComponent', () => {
  let component: FacFaqComponent;
  let fixture: ComponentFixture<FacFaqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
