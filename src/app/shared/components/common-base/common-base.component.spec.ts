import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonBaseComponent } from './common-base.component';

describe('CommonBaseComponent', () => {
  let component: CommonBaseComponent;
  let fixture: ComponentFixture<CommonBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
