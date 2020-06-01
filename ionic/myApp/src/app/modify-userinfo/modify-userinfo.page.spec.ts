import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModifyUserinfoPage } from './modify-userinfo.page';

describe('ModifyUserinfoPage', () => {
  let component: ModifyUserinfoPage;
  let fixture: ComponentFixture<ModifyUserinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyUserinfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyUserinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
