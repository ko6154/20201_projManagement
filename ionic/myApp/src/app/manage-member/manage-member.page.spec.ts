import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageMemberPage } from './manage-member.page';

describe('ManageMemberPage', () => {
  let component: ManageMemberPage;
  let fixture: ComponentFixture<ManageMemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMemberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
