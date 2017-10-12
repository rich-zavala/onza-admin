import { TestBed, inject } from '@angular/core/testing';

import { InmueblesService } from './inmuebles.service';

describe('InmueblesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InmueblesService]
    });
  });

  it('should be created', inject([InmueblesService], (service: InmueblesService) => {
    expect(service).toBeTruthy();
  }));
});
