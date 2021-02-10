import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NpiModalComponent } from './npi-modal.component';

describe('NpiModalComponent', () => {
  let component: NpiModalComponent;
  let fixture: ComponentFixture<NpiModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
