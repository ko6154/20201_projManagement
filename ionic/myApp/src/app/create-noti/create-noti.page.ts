import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service'
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-create-noti',
  templateUrl: './create-noti.page.html',
  styleUrls: ['./create-noti.page.scss'],
})
export class CreateNotiPage{

  noti = {
    title: '',
    desc: '',
    proj_id: '',
    author: '',
    created: ''
  }


  constructor(
    private http: HttpService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private storage: StorageService,
    private dataService: DataService
    ){
    storage.get_uid().then(val => {
      this.noti.author = val;
    });
    this.noti.proj_id  = this.dataService.getProjectID();
    
  }

  
  create_noti() {
    let now = new Date().toISOString();
    let created = now.substr(0, 10) + " " + now.split('T')[1].substr(0, 8);
    this.noti.created = created;

    this.http.create_noti(this.noti).then(
      ret => {
        console.log(ret['create']);
        if (ret['create'] == 'success') {
            this.alertController.create({
              header: 'Confirm!',
              subHeader: '작업 추가 성공!',
              message: '업무리스트로 이동합니다.',
              buttons: [{
                text: '확인',
                handler: () => {
                  this.navCtrl.navigateForward('/task-list');
                }
              }]
            }).then(alert => {
              alert.present();
            });
        } else {
          this.alertController.create({
            header: 'Reject!',
            subHeader: '작업 추가 실패',
            message: '입력값을 확인해주세요.',
            buttons: [{
              text: '확인'
            }]
          }).then(alert => {
            alert.present();
          });
        }
      });
  }

}
