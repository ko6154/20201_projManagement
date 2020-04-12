import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { HttpService } from '../http_service_module/http.service';
import { FormGroup } from '@angular/forms';
import { StorageService } from '../storage_service_module/storage.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  private user = {
    email: '',
    password: ''
  }

  constructor(
    private http: HttpService,
    private navCtrl: NavController,
    private storage: StorageService,
	private alertController : AlertController
  ) {}

  

  async ngOnInit() {
    await this.storage.get_uid()
    .then(val=>{
      this.user.email = val;
    });
    await this.storage.get_pw()
    .then(val=>{
      this.user.password= val;
    });

    if(this.user.email != null && this.user.email != "")
      this.login();
  }

  ionViewWillEnter(){
    this.ngOnInit();
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      header: '로그인 실패',
      subHeader: '',
      message: '계정이 존재하지 않거나 비밀번호가 올바르지 않습니다.',
      buttons: ['확인']
    });

    await alert.present();
  }

  login(){
    this.http.login(this.user).subscribe(
      res => {
        if(res["login"] === "success"){
          console.log("loginpage success");
          this.storage.set_uid(this.user.email);
          this.storage.set_pw(this.user.password);
          this.goMainPage();
        }else{
			this.presentAlertMultipleButtons();
          console.log("loginpage fail");
		  
        }
      },
      error => {
		
        this.storage.del_uid();
        this.storage.del_pw();
        console.log(error.status);
        console.log(error.error);
        console.log(error.headers);
      }
    );
  }

  goSignUp() {
    this.navCtrl.navigateForward('/signup');
  }
  goMainPage(){
    this.navCtrl.navigateForward('/main');
  }

}
