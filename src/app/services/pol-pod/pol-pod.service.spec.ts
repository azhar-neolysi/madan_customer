import { TestBed } from '@angular/core/testing';

import { PolPodService } from './pol-pod.service';

describe('PolPodService', () => {
  let service: PolPodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolPodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
