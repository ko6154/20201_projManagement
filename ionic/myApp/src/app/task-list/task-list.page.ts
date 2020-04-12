import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service'
import { StorageService } from '../storage_service_module/storage.service'
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage {
  isPM: boolean;
  project_id: string;
  project_name: string;

  notiIsOpen: boolean;
  notis: Array<{}> = [];

  taskIsOpen: boolean;
  tasks: Array<{}> = [];

  public bigIsOpen: Array<Map<string, boolean>> = [];
  public midIsOpen: Array<Map<string, boolean>> = [];

  constructor(
    private http: HttpService,
    private storage: StorageService,
    private navCtrl : NavController,
    private alertCtrl: AlertController,
    private dataService : DataService
  ) {
    
  }

  ionViewWillEnter(){
    this.initailize();
  }

  async initailize() {
    console.log("initialize");
    this.notiIsOpen = false;
    this.taskIsOpen = false;

    this.project_id = this.dataService.getProjectID();
    this.project_name = this.dataService.getProjectName();
    let manager_id = this.dataService.getManagerID();
    
    this.isPM = false;
    await this.storage.get_uid().then(
      async uid => {
        this.isPM = uid === manager_id;
      },
      error=>{
        console.log(error);
      }
    );

    await this.http.get_noti_list(this.project_id).then(
      (res: any[]) => {
        let tmp: Array<{}> = [];
        if(res == null) return;
        res.forEach(function (val, idx, arr) {
          tmp.push({
            id: val["NOTI_ID"],
            title: val["NOTI_TITLE"],
            desc: val["NOTI_DESC"],
            status: val["NOTI_STATUS"],
            author: val["NOTI_AUTHOR"],
            created: val["NOTI_CREATED"]
          });
        });
        this.notis = tmp;
      },
      error=>{
        console.log(error);
      }
    );
    
    await this.http.get_task_big_listp(this.project_id).then(
      (res: any[]) => {
        let tmp: Array<{}> = [];
        if(res == null) return;
        res.forEach(function (val, idx, arr) {
          tmp.push({
            id: val["BIG_ID"],
            title: val["BIG_TITLE"],
            start: val["BIG_START"],
            end: val["BIG_END"],
            author: val["BIG_AUTHOR"],
            created: val["BIG_CREATED"],
            desc: val["BIG_DESC"],
            attach: val["BIG_ATTACHMENT"],
            status: val["BIG_STATUS"],
            weight: val["BIG_WEIGHT"],
            mids: []
          });

          if(tmp[tmp.length-1]['status'] == -1){
            tmp.pop();
          }

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
              start: val["MID_START"],
              end: val["MID_END"],
              author: val["MID_AUTHOR"],
              created: val["MID_CREATED"],
              desc: val["MID_DESC"],
              attach: val["MID_ATTACHMENT"],
              status: val['MID_STATUS'],
              smls: []
            });
            if(tmp[tmp.length-1]['status'] == -1){
              tmp.pop();
            }
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
    this.calculate_post_progress();
  }

  calculate_post_progress(){
    var progress = 0;
    for(var big=0; big<this.tasks.length; ++big){

      if(this.tasks[big]['status'] == 1){   // if big completed
        progress += this.tasks[big]['weight'];    // add big progress
        for(var mid=0; mid<this.tasks[big]['mids'].length; ++mid){    // make all descendant mids complete
          if(this.tasks[big]['mids'][mid]['status'] != '1'){
            this.http.update_post_state('mid', this.tasks[big]['mids'][mid]['id'], '1');
            this.tasks[big]['mids'][mid]['status'] = '1';
          }
          for(var sml=0; sml<this.tasks[big]['mids'][mid]["smls"].length; ++sml){   // make all descendant smls complete
            if(this.tasks[big]['mids'][mid]['smls'][sml]['status'] != '1'){
              this.http.update_post_state('sml', this.tasks[big]['mids'][mid]['smls'][sml]['id'], '1');
              this.tasks[big]['mids'][mid]['smls'][sml]['status'] = '1';
            }
          }
        }

      }else if(this.tasks[big]['mids'].length > 0){  // if big not completed and mid exists
        for(var mid=0; mid<this.tasks[big]['mids'].length; ++mid){

          if(this.tasks[big]['mids'][mid]['status'] == 1){  // if mid completed
            progress += this.tasks[big]['weight'] * (1/this.tasks[big]['mids'].length);   // add mid progress
            for(var sml=0; sml<this.tasks[big]['mids'][mid]["smls"].length; ++sml){   // make all descendant smls complete 
              if(this.tasks[big]['mids'][mid]['smls'][sml]['status'] != '1'){
                this.http.update_post_state('sml', this.tasks[big]['mids'][mid]['smls'][sml]['id'], '1');
                this.tasks[big]['mids'][mid]['smls'][sml]['status'] = '1';
              }
            }
  
          }else if(this.tasks[big]['mids'][mid]["smls"].length > 0){  // if mid not completed and sml exists
            var sml_complete = 0;
            for(var sml=0; sml<this.tasks[big]['mids'][mid]["smls"].length; ++sml){   // count completed smls
              if(this.tasks[big]['mids'][mid]['smls'][sml]['status'] == 1){
                ++sml_complete;
              }
            }

            var sml_progress = 0;
            sml_progress += sml_complete/this.tasks[big]['mids'][mid]['smls'].length;
            progress += this.tasks[big]['weight'] * (sml_progress/this.tasks[big]['mids'].length);
          }
        }  
      }
    }
    console.log('progress: '+progress);
    this.http.update_project_progress(this.project_id, progress.toString());
  }


  toggle(argu: boolean) {
    console.log(argu);
    return argu ? false : true;
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
    let pre_path = `http://155.230.90.22:9000/download?path=`;
    
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

  go_create_page(val: string){ 
    this.navCtrl.navigateForward(`/create-${val}`);
  }
  
  clipboard_copy(val : string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  attend_dialog(){
    let base_url = "13.124.150.35:9010/attend-project/"
    base_url += this.dataService.getLink();
    this.clipboard_copy(base_url);
    this.alertCtrl.create({
      header: '프로젝트 참가 링크',
      subHeader: '클립보드에 복사 되었습니다.',
      message: base_url, 
      buttons: [{
        text: '확인',
        handler:() => {

        }
      }]
    }).then(alert=>{
      alert.present();
    })
  }
  update_status(status: string){
    let header :string;
    if(status == '1'){
      header = "프로젝트 완료"
    }else if(status == '-1'){
      header = "프로젝트 삭제"
    }

    this.http.update_project_state(this.project_id,status).then(res=>{
      if(res['check'] == 'yes'){
        this.alertCtrl.create({
          header: header,
          subHeader: '성공!',
          buttons: [{
            text: '확인',
            handler:() => {
              this.navCtrl.navigateForward('/main');
            }
          }]
        }).then(alert=>{
          alert.present();
        })
      }else{
        this.alertCtrl.create({
          header: header,
          subHeader: '실패 했습니다.',
          buttons: [{
            text: '확인',
            handler:() => {
              this.navCtrl.navigateForward('/main');
            }
          }]
        }).then(alert=>{
          alert.present();
        })
      }
    });
  }
  goBack(){
  	  this.navCtrl.pop();
  }
}
