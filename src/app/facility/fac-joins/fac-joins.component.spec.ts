import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacJoinsComponent } from './fac-joins.component';

describe('FacJoinsComponent', () => {
  let component: FacJoinsComponent;
  let fixture: ComponentFixture<FacJoinsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacJoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacJoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
