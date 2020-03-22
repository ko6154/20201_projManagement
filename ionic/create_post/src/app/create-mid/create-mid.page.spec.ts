import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMidPage } from './create-mid.page';

describe('CreateMidPage', () => {
  let component: CreateMidPage;
  let fixture: ComponentFixture<CreateMidPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMidPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
