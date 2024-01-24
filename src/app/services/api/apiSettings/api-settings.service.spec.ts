import { TestBed } from '@angular/core/testing';

import { ApiSettingsService } from './api-settings.service';

describe('ApiSettingsService', () => {
  let service: ApiSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
