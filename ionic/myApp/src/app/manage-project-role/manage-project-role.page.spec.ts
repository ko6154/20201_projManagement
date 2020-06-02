import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageProjectRolePage } from './manage-project-role.page';

describe('ManageProjectRolePage', () => {
  let component: ManageProjectRolePage;
  let fixture: ComponentFixture<ManageProjectRolePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProjectRolePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageProjectRolePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
