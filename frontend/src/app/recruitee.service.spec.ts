import { TestBed } from '@angular/core/testing';

import { RecruiteeService } from './recruitee.service';

describe('RecruiteeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecruiteeService = TestBed.get(RecruiteeService);
    expect(service).toBeTruthy();
  });
});
