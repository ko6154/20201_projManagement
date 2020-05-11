import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WhiteboardPage } from './whiteboard.page';

describe('WhiteboardPage', () => {
  let component: WhiteboardPage;
  let fixture: ComponentFixture<WhiteboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhiteboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WhiteboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
