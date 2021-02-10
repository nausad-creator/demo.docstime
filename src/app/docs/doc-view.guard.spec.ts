import { TestBed } from '@angular/core/testing';

import { DocViewGuard } from './doc-view.guard';

describe('DocViewGuard', () => {
  let guard: DocViewGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DocViewGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
