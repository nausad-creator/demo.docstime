import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocFaqComponent } from './doc-faq.component';

describe('DocFaqComponent', () => {
  let component: DocFaqComponent;
  let fixture: ComponentFixture<DocFaqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
