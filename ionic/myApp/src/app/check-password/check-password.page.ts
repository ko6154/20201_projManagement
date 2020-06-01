import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-check-password',
  templateUrl: './check-password.page.html',
  styleUrls: ['./check-password.page.scss'],
})
export class CheckPasswordPage implements OnInit {

  userId: string;
  userPassword: string;
  userInputPassword: string;

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

    await this.storage.get_pw()
    .then(val => {
      this.userPassword = val;
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  checkPassword() {
    if(this.userPassword == this.userInputPassword) {
      this.goModifyUserInfo();
    }
    else {
      this.alertController.create({
        header: "확인 실패",
        message: "비밀번호가 일치하지 않습니다.",
        buttons: [{
          text: '확인',
        }]
      }).then(alert=>{
        alert.present();
      })
    }
  }
  goModifyUserInfo() {
    this.navCtrl.navigateForward("/modify-userinfo");
  }
}
