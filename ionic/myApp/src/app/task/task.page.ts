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
  post_bigs: Array<{}> = [];
  

  public bigIsOpen: Array<Map<string, boolean>> = [];
  public midIsOpen: Array<Map<string, boolean>> = [];

  constructor(
    private http: HttpService,
    private navCtrl : NavController,
    private dataService : DataService
  ) { 


  }

  ngOnInit() {
    this.initailize();


  }



  go_create_page(val: string){ 
    this.navCtrl.navigateForward(`/create-${val}`);
  }

  

  go_board(type: string, ...args: any) {
    var len = args.length-1;
    let title  = args[len]['title'];
    let id = args[len].id;
    let start  = args[len].start;
    let end  = args[len].end;
    let author  = args[len].author;
    let created  = args[len].created;
    let desc  = args[len].desc;
    let attach: any;
    if(type != 'noti')
     attach = args[len].attach.split("*");
    let attaches = new Array();
    let pre_path = `http://52.55.31.29:8000/download?path=`;
    
    if(type != 'noti'){
      for(var i=0; i<attach.length-1; ++i){
        var path = pre_path+attach[i];
        var tmp = attach[i].split("/");
        attaches.push({name: tmp[tmp.length-1], path: path});
      }
    }
    
    this.dataService.setType(type);
    this.dataService.setBoardID(id);
    this.dataService.setTitle(title);
    this.dataService.setStart(start);
    this.dataService.setEnd(end);
    this.dataService.setAuthor(author);
    this.dataService.setCreated(created);
    this.dataService.setDesc(desc);
    this.dataService.setAttaches(attaches);
    
    console.log(type)
    console.log(title)
    console.log(start)
    console.log(author)
    console.log(created)
    console.log(desc)
    console.log(attaches)

    this.navCtrl.navigateForward('/board');
  }
  
  toggle(argu: boolean) {
    console.log(argu);
    return argu ? false : true;
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

    this.http.get_task_big_list(this.project_id).subscribe(
      (res: any[])  => {
        let tmp_post_big: Array<{}> = [];
        res.forEach(function (value){
          tmp_post_big.push({
            BigID: value["BIG_ID"],
            level: value["BIG_LEVEL"],
            title: value["BIG_TITLE"],
            status: value["BIG_STATUS"]
          });
          if(tmp_post_big[tmp_post_big.length-1]['status'] == '1')
            tmp_post_big.pop();
        });
        this.post_bigs = tmp_post_big;
      }
    ); 
  }
}
