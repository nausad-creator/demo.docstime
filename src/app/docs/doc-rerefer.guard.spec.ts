import { TestBed } from '@angular/core/testing';

import { DocRereferGuard } from './doc-rerefer.guard';

describe('DocRereferGuard', () => {
  let guard: DocRereferGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DocRereferGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
