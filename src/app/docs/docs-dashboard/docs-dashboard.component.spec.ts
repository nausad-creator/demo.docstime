import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocsDashboardComponent } from './docs-dashboard.component';

describe('DocsDashboardComponent', () => {
  let component: DocsDashboardComponent;
  let fixture: ComponentFixture<DocsDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
