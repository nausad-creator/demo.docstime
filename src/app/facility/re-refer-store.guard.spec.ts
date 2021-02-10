import { TestBed } from '@angular/core/testing';

import { ReReferStoreGuard } from './re-refer-store.guard';

describe('ReReferStoreGuard', () => {
  let guard: ReReferStoreGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReReferStoreGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
