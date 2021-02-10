import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyScheduledViewReferComponent } from './my-scheduled-view-refer.component';

describe('MyScheduledViewReferComponent', () => {
  let component: MyScheduledViewReferComponent;
  let fixture: ComponentFixture<MyScheduledViewReferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyScheduledViewReferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyScheduledViewReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
