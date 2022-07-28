import { TestBed } from '@angular/core/testing';

import { ConsignerService } from './consigner.service';

describe('ConsignerService', () => {
  let service: ConsignerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsignerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
