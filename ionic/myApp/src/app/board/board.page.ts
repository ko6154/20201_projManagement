import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service'
import { DataService } from '../services/data.service'
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {
  user: string;

  // board
  type: string;
  title : string;
  desc : string;
  author : string;
  start: string;
  end: string;
  created: string;
  attaches: any;
  id: string;
  
  // comment
  comment: string;
  comments = new Array();

  isOwner: boolean;
  isPM: boolean;

  constructor(
    private http: HttpService,
    private dataservice: DataService,
    private storage: StorageService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  )
  { 
    this.type = this.dataservice.getType();
    this.title = this.dataservice.getTitle();
    this.desc = this.dataservice.getDesc();
    this.author = this.dataservice.getAuthor();
    this.id = this.dataservice.getBoardID();
    this.created = this.dataservice.getCreated();
    
    if(this.type != 'noti'){
      this.start = this.dataservice.getStart();
      this.end = this.dataservice.getEnd();
      this.attaches = this.dataservice.getAttaches();
    }
    
    
  }

  async ngOnInit() {
    this.user = await this.storage.get_uid();
    let pm = this.dataservice.getManagerID();
    
    this.isOwner = this.user == this.author;
    this.isPM = this.user == pm;

    let res : any;
    switch(this.type){
      case 'noti':
        res = await this.http.get_comment_noti_list(this.id); break;
      case 'big':
        res = await this.http.get_comment_big_list(this.id); break;
      case 'mid':
        res = await this.http.get_comment_mid_list(this.id); break;
      case 'sml':
        res = await this.http.get_comment_sml_list(this.id); break;
    }
    

    for(var i=0; i<res.length; ++i){
      var created = this.dateConvertorCreate(res[i]['BIGC_TIME']);
      var owner = res[i]['BIGC_AUTHOR'] == this.user;
      var tmp = {
        id: res[i]['BIGC_ID'],
        author: res[i]['BIGC_AUTHOR'],
        body: res[i]['BIGC_COMMENT'],
        created: created,
        owner: owner
      }
      this.comments.push(tmp);
    }
    console.log(this.comments);
  }

  async insertComment(){
    let id = this.id;
    let author = this.user;
    let context = this.comment;
    let now = new Date().toISOString();
    let created = now.substr(0, 10) + " " + now.split('T')[1].substr(0, 8);

    let res : any;
    switch(this.type){
      case 'noti':
        res = await this.http.insert_comment_noti(id, author, context, created, '0'); break;
      case 'big':
        res = await this.http.insert_comment_big(id, author, context, created, '0'); break;
      case 'mid':
        res = await this.http.insert_comment_mid(id, author, context, created, '0'); break;
      case 'sml':
        res = await this.http.insert_comment_sml(id, author, context, created, '0'); break;
    }
    console.log(res);

    let tmp = {
      id: id,
      author: author,
      body: context,
      created: created,
      owner: true
    }
    this.comments.push(tmp);
  }

  async delComment(comment: any){
    let id = comment.id;
    let res : any;
    switch(this.type){
      case 'noti':
        res = await this.http.del_comment_noti(id); break;
      case 'big':
        res = await this.http.del_comment_big(id); break;
      case 'mid':
        res = await this.http.del_comment_mid(id); break;
      case 'sml':
        res = await this.http.del_comment_sml(id); break;
    }
   
    const index = this.comments.indexOf(comment, 0);
    if (index > -1) {
      this.comments.splice(index, 1);
    }
  }

  async update_status(status: string){
    let header :string;
    if(status == '1'){
      header = this.title +" 완료";
    }else if(status == '-1'){
      header = this.title +" 삭제";
    }

    let res = await this.http.update_post_state(this.type, this.id, status);
    if(res['check'] == 'yes'){
      this.alertCtrl.create({
        header: header,
        subHeader: '성공!',
        buttons: [{
          text: '확인',
          handler:() => {
            this.navCtrl.navigateForward('/task-list');
          }
        }]
      }).then(alert=>{
        alert.present();
      })
    }else{
      this.alertCtrl.create({
        header: header,
        subHeader: '실패 했습니다.',
        message: '잠시 후 다시 시도해주세요.',
        buttons: [{
          text: '확인',
          handler:() => {

          }
        }]
      }).then(alert=>{
        alert.present();
      })
    }

  }

  dateConvertor(date: string) : string{
    date = date.substr(0, 10) + " " + date.split('T')[1].substr(0, 5);
    return date;
  }
  dateConvertorCreate(date: string) : string{
    date = date.substr(0, 10) + " " + date.split('T')[1].substr(0, 8);
    return date;
  }
}
