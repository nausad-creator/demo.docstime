import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocPrivacyPolicyComponent } from './doc-privacy-policy.component';

describe('DocPrivacyPolicyComponent', () => {
  let component: DocPrivacyPolicyComponent;
  let fixture: ComponentFixture<DocPrivacyPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocPrivacyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
