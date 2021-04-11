import { TestBed } from '@angular/core/testing';

import { ApiServciesService } from './api-servcies.service';

describe('ApiServciesService', () => {
  let service: ApiServciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiServciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
