import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyScheduledReReferComponent } from './my-scheduled-re-refer.component';

describe('MyScheduledReReferComponent', () => {
  let component: MyScheduledReReferComponent;
  let fixture: ComponentFixture<MyScheduledReReferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyScheduledReReferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyScheduledReReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
