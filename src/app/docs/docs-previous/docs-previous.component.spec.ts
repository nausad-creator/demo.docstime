import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocsPreviousComponent } from './docs-previous.component';

describe('DocsPreviousComponent', () => {
  let component: DocsPreviousComponent;
  let fixture: ComponentFixture<DocsPreviousComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsPreviousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsPreviousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
