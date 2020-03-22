import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSmallPage } from './create-small.page';

describe('CreateSmallPage', () => {
  let component: CreateSmallPage;
  let fixture: ComponentFixture<CreateSmallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSmallPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSmallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
