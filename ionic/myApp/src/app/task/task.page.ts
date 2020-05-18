import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  project_id: string;
  tasks: Array<{}> = [];

  constructor(
    private http: HttpService,
    private navCtrl : NavController,
    private dataService : DataService
  ) { }

  ngOnInit() {
  }
  go_create_page(val: string){ 
    this.navCtrl.navigateForward(`/create-${val}`);
  }

  async initailize() {

    this.project_id = this.dataService.getProjectID();

  await this.http.get_task_big_listp(this.project_id).then(
    (res: any[]) => {
      let tmp: Array<{}> = [];
      if(res == null) return;
      res.forEach(function (val, idx, arr) {
        tmp.push({
          id: val["BIG_ID"],
          title: val["BIG_TITLE"],
          author: val["BIG_AUTHOR"],
          desc: val["BIG_DESC"],
          attach: val["BIG_ATTACHMENT"],
          mids: []
        });

      });
      this.tasks = tmp;
    },
    error=>{
      console.log(error);
    });
  }
}
