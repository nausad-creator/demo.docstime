import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestModalComponent } from './request-modal.component';

describe('RequestModalComponent', () => {
  let component: RequestModalComponent;
  let fixture: ComponentFixture<RequestModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
