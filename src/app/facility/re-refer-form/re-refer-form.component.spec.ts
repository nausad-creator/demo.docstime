import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReReferFormComponent } from './re-refer-form.component';

describe('ReReferFormComponent', () => {
  let component: ReReferFormComponent;
  let fixture: ComponentFixture<ReReferFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReReferFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReReferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
