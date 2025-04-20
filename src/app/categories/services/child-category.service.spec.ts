import { TestBed } from '@angular/core/testing';

import { ChildCategoryService } from './child-category.service';

describe('ChildCategoryService', () => {
  let service: ChildCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChildCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
