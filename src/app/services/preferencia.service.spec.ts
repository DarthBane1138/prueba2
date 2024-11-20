import { TestBed } from '@angular/core/testing';

import { PreferenciaService } from './preferencia.service';

describe('PreferenciaService', () => {
  let service: PreferenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
