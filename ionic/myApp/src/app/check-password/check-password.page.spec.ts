import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckPasswordPage } from './check-password.page';

describe('CheckPasswordPage', () => {
  let component: CheckPasswordPage;
  let fixture: ComponentFixture<CheckPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckPasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
