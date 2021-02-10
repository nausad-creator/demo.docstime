import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocAboutUsComponent } from './doc-about-us.component';

describe('DocAboutUsComponent', () => {
  let component: DocAboutUsComponent;
  let fixture: ComponentFixture<DocAboutUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocAboutUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
