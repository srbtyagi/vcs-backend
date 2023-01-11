import { TestBed } from '@angular/core/testing';

import { DropdownServiceService } from './dropdown-service.service';

describe('DropdownServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DropdownServiceService = TestBed.get(DropdownServiceService);
    expect(service).toBeTruthy();
  });
});
