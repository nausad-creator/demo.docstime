import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewReferComponent } from './view-refer.component';

describe('ViewReferComponent', () => {
  let component: ViewReferComponent;
  let fixture: ComponentFixture<ViewReferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
