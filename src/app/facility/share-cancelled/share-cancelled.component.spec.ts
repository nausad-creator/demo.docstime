import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareCancelledComponent } from './share-cancelled.component';

describe('ShareCancelledComponent', () => {
  let component: ShareCancelledComponent;
  let fixture: ComponentFixture<ShareCancelledComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareCancelledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
