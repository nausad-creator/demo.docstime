import { TestBed } from '@angular/core/testing';

import { DocsGuard } from './docs.guard';

describe('DocsGuard', () => {
  let guard: DocsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DocsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
