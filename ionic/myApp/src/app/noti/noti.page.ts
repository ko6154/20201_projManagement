import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-noti',
  templateUrl: './noti.page.html',
  styleUrls: ['./noti.page.scss'],
})
export class NotiPage {
  constructor(
    private http: HttpService,
    private storage: StorageService,
    private navCtrl : NavController,
    private alertCtrl: AlertController,
	  private menu: MenuController,
    private dataService : DataService
  ) {}
  
  isPM: boolean;
  project_id: string;
  project_name: string;

  notis: Array<{}> = [];

  ionViewWillEnter(){
    this.initailize();
  }

  async initailize() {
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
    for(var i = 0; i < this.notis.length; i++) {
      var time = this.notis[i]["created"].substr(0, 10);
      time += "/";
      time += this.notis[i]["created"].substr(11, 8);
      this.notis[i]["created"] = time;
    }
    this.notis.reverse();
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
  goCreateNoti() {
    this.navCtrl.navigateForward('/create-noti');
  }
}
