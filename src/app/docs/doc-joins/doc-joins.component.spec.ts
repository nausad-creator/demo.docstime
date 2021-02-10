import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocJoinsComponent } from './doc-joins.component';

describe('DocJoinsComponent', () => {
  let component: DocJoinsComponent;
  let fixture: ComponentFixture<DocJoinsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocJoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocJoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
