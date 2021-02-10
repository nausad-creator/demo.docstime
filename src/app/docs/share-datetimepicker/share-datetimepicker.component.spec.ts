import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareDatetimepickerComponent } from './share-datetimepicker.component';

describe('ShareDatetimepickerComponent', () => {
  let component: ShareDatetimepickerComponent;
  let fixture: ComponentFixture<ShareDatetimepickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareDatetimepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDatetimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
