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

  taskIsOpen: boolean;
  tasks: Array<{}> = [];

  public bigIsOpen: Array<Map<string, boolean>> = [];
  public midIsOpen: Array<Map<string, boolean>> = [];

  constructor(
    private http: HttpService,
    private navCtrl : NavController,
    private dataService : DataService
  ) { }

  ngOnInit() {
    this.initailize();
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

    for (let i = 0; i < this.tasks.length; ++i) {
      await this.http.get_task_mid_listp(this.tasks[i]["id"]).then(
        (res: any[]) => {
          let tmp: Array<{}> = [];
          if(res == null) return;
          res.forEach(function (val, idx, arr) {
            tmp.push({
              id: val["MID_ID"],
              title: val["MID_TITLE"],
              author: val["MID_AUTHOR"],
              desc: val["MID_DESC"],
              attach: val["MID_ATTACHMENT"],
              smls: []
            });
          });
          this.tasks[i]["mids"] = tmp;
        },
        error=>{
          console.log(error);
        });

      this.bigIsOpen.push(new Map<string, boolean>().set(this.tasks[i]["id"], false));

      for (let j = 0; j < this.tasks[i]["mids"].length; ++j) {
        await this.http.get_task_sml_listp(this.tasks[i]["mids"][j]["id"]).then(
          (res: any[]) => {
            console.log(this.tasks[i]["mids"][j]["id"]);
            let tmp: Array<{}> = [];
            if(res == null) return;
            res.forEach(function (val, idx, arr) {
              tmp.push({
                id: val["SML_ID"],
                title: val["SML_TITLE"],
                start: val["SML_START"],
                end: val["SML_END"],
                author: val["SML_AUTHOR"],
                created: val["SML_CREATED"],
                desc: val["SML_DESC"],
                attach: val["SML_ATTACHMENT"],
                status: val['SML_STATUS']
              });

              if(tmp[tmp.length-1]['status'] == -1){
                tmp.pop();
              }
            });
            this.tasks[i]["mids"][j]["smls"] = tmp;
          },
          error=>{
            console.log(error);
          });

        this.midIsOpen.push(new Map<string, boolean>().set(this.tasks[i]["mids"][j]["id"], false));
      }
    }
  }
}
