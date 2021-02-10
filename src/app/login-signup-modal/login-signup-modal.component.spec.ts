import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginSignupModalComponent } from './login-signup-modal.component';

describe('LoginSignupModalComponent', () => {
  let component: LoginSignupModalComponent;
  let fixture: ComponentFixture<LoginSignupModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSignupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSignupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
