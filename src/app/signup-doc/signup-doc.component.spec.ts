import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignupDocComponent } from './signup-doc.component';

describe('SignupDocComponent', () => {
  let component: SignupDocComponent;
  let fixture: ComponentFixture<SignupDocComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
