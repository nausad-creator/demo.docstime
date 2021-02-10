import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocContactUsComponent } from './doc-contact-us.component';

describe('DocContactUsComponent', () => {
  let component: DocContactUsComponent;
  let fixture: ComponentFixture<DocContactUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocContactUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
