import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modify-userinfo',
  templateUrl: './modify-userinfo.page.html',
  styleUrls: ['./modify-userinfo.page.scss'],
})
export class ModifyUserinfoPage implements OnInit {

  userId: string;

  userInfo = {
    userId: "",
    userInputPassword1: "",
    userInputPassword2: ""
  };

  constructor(
    private httpService : HttpService,
    private storage : StorageService,
    private navCtrl : NavController,
    private dataService: DataService,
  	private menu: MenuController,
    public toastController: ToastController,
    public alertController: AlertController
  ) { }

  ionViewWillEnter(){
    this.ngOnInit();
  }

  async ngOnInit() {
    await this.storage.get_uid()
    .then(val => {
      this.userId = val;
    });
    this.userInfo.userId = this.userId;
  }

  checkPassword() {
    if(this.userInfo.userInputPassword1 == this.userInfo.userInputPassword2) {
      this.goModify();
    }
    else {
      this.alertController.create({
        header: "실패",
        message: "비밀번호가 일치하지 않습니다.",
        buttons: [{
          text: '확인',
        }]
      }).then(alert=>{
        alert.present();
      })
    }
  }

  goModify() {
    this.httpService.modify_userInfo(this.userInfo).then (
      ret => {
        if (ret["modify"] == "success") {
          this.alertController.create({
            header: '수정 성공',
            message: '다음 로그인은 새로운 비밀번호로 로그인 해주세요.',
            buttons: [{
              text: '확인',
              handler: () => {
                this.storage.set_pw(this.userInfo.userInputPassword1);
                this.navCtrl.navigateForward('/main');
              }
            }]
          }).then(alert => {
            alert.present();
          });
        }
        else {

        }
      }
    );
  }

  goBack() {
    this.navCtrl.navigateForward("/main");
  }
}
