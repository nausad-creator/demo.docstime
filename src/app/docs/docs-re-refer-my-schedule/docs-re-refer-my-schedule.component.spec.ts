import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocsReReferMyScheduleComponent } from './docs-re-refer-my-schedule.component';

describe('DocsReReferMyScheduleComponent', () => {
  let component: DocsReReferMyScheduleComponent;
  let fixture: ComponentFixture<DocsReReferMyScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsReReferMyScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsReReferMyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
