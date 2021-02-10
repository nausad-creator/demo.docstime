import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DortorViewComponent } from './dortor-view.component';

describe('DortorViewComponent', () => {
  let component: DortorViewComponent;
  let fixture: ComponentFixture<DortorViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DortorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DortorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
