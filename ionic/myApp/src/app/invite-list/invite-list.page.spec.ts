import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InviteListPage } from './invite-list.page';

describe('InviteListPage', () => {
  let component: InviteListPage;
  let fixture: ComponentFixture<InviteListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
