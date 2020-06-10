import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoveroneComponent } from './popoverone.component';

describe('PopoveroneComponent', () => {
  let component: PopoveroneComponent;
  let fixture: ComponentFixture<PopoveroneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoveroneComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoveroneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
