import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberPage } from './add-member.page';

describe('AddMemberPage', () => {
  let component: AddMemberPage;
  let fixture: ComponentFixture<AddMemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
