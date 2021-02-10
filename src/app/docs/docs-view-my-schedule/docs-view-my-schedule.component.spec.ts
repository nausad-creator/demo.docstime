import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocsViewMyScheduleComponent } from './docs-view-my-schedule.component';

describe('DocsViewMyScheduleComponent', () => {
  let component: DocsViewMyScheduleComponent;
  let fixture: ComponentFixture<DocsViewMyScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsViewMyScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsViewMyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
