import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocsRouterOutletComponent } from './docs-router-outlet.component';

describe('DocsRouterOutletComponent', () => {
  let component: DocsRouterOutletComponent;
  let fixture: ComponentFixture<DocsRouterOutletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsRouterOutletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsRouterOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
