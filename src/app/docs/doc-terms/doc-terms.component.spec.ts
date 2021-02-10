import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocTermsComponent } from './doc-terms.component';

describe('DocTermsComponent', () => {
  let component: DocTermsComponent;
  let fixture: ComponentFixture<DocTermsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
