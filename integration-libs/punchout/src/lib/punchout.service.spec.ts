import { TestBed } from '@angular/core/testing';

import { PunchoutService } from './punchout.service';

describe('PunchoutService', () => {
  let service: PunchoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PunchoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
