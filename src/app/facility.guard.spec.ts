import { TestBed } from '@angular/core/testing';

import { FacilityGuard } from './facility.guard';

describe('FacilityGuard', () => {
  let guard: FacilityGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FacilityGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
