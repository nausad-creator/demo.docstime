import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocsUpcommingComponent } from './docs-upcomming.component';

describe('DocsUpcommingComponent', () => {
  let component: DocsUpcommingComponent;
  let fixture: ComponentFixture<DocsUpcommingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsUpcommingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsUpcommingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
