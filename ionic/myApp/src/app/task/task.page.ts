import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  constructor(
    private navCtrl : NavController,
  ) { }

  ngOnInit() {
  }
  go_create_page(val: string){ 
    this.navCtrl.navigateForward(`/create-${val}`);
  }
}
