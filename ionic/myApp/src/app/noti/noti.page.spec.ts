import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotiPage } from './noti.page';

describe('NotiPage', () => {
  let component: NotiPage;
  let fixture: ComponentFixture<NotiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
