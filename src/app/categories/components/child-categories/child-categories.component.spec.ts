import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildCategoriesComponent } from './child-categories.component';

describe('ChildCategoriesComponent', () => {
  let component: ChildCategoriesComponent;
  let fixture: ComponentFixture<ChildCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChildCategoriesComponent]
    });
    fixture = TestBed.createComponent(ChildCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
