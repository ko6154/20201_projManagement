import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBigPage } from './create-big.page';

describe('CreateBigPage', () => {
  let component: CreateBigPage;
  let fixture: ComponentFixture<CreateBigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBigPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
