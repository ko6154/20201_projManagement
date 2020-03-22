import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttendProjectPage } from './attend-project.page';

describe('AttendProjectPage', () => {
  let component: AttendProjectPage;
  let fixture: ComponentFixture<AttendProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendProjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
