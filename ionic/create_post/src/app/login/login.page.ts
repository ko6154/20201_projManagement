import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { HttpService } from '../http_service_module/http.service';
import { FormGroup } from '@angular/forms';
import { StorageService } from '../storage_service_module/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  private user = {
    email: '',
    password: ''
  }

  constructor(
    private http: HttpService,
    private navCtrl: NavController,
    private storage: StorageService
  ) { }

  

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

  login(){
    this.http.login(this.user).subscribe(
      res => {
        if(res["login"] === "success"){
          console.log("loginpage success");
          this.storage.set_uid(this.user.email);
          this.storage.set_pw(this.user.password);
          this.goMainPage();
        }else{
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
