import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateProjectPage } from './generate-project.page';

describe('GenerateProjectPage', () => {
  let component: GenerateProjectPage;
  let fixture: ComponentFixture<GenerateProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateProjectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
