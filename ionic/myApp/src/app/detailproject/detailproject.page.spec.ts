import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailprojectPage } from './detailproject.page';

describe('DetailprojectPage', () => {
  let component: DetailprojectPage;
  let fixture: ComponentFixture<DetailprojectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailprojectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailprojectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
