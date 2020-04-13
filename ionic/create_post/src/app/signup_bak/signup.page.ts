import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HttpService } from '../http_service_module/http.service';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignupPage{
  
  constructor(
      private http: HttpService,
      private navCtrl: NavController,
      private alertController : AlertController
    ) {}

  user = {
    email: '',
    password: '',
    name: '',
    department: ''
  }
  
  sign_up(form: FormGroup){
    this.http.register(form.value).subscribe(
      res => {
        if(res["register"] === "success"){
          this.alertController.create({
            header: 'Confirm!',
            subHeader: '계정 만들기 성공!',
            message: '로그인 화면으로 이동합니다.',
            buttons: [{
              text: '확인',
              handler:() =>{
                this.navCtrl.navigateForward('/login');
              }
            }]
          }).then(alert=>{
            alert.present();
          });
        }else{
          this.alertController.create({
            header: 'Reject!',
            subHeader: '계정 만들기 실패ㅠ',
            message: '잠시후 다시 시도해주세요.',
            buttons: [{
              text: '확인'
            }]
          }).then(alert=>{
            alert.present();
          });
        }
      },
      error => {
        console.log(error.status);
        console.log(error.error);
        console.log(error.headers);
      }
    );
  }

}
