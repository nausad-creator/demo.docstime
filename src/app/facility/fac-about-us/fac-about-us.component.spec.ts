import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacAboutUsComponent } from './fac-about-us.component';

describe('FacAboutUsComponent', () => {
  let component: FacAboutUsComponent;
  let fixture: ComponentFixture<FacAboutUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacAboutUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
