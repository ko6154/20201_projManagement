import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {
  constructor(
    private http: HttpService,
    private storage: StorageService,
    private navCtrl : NavController,
    private alertCtrl: AlertController,
	  private menu: MenuController,
    private dataService : DataService
  ) { }

  isPM: boolean;
  project_id: string;
  project_name: string;

 

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
  }
  goHome(){
    this.navCtrl.navigateForward("/main");
  }
  openCustom() {
    this.menu.enable(true, 'second');
      this.menu.open('second');
  }
  goAddMember(){
    this.navCtrl.navigateForward("/add-member");
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
}
