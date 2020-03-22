import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './../services/data.service'
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {
  SERVER_ADDRESS: string = "http://155.230.90.22:9000";
  private user = {
    email: '',
    password: ''
  }
  private proj_id : any;
  constructor(private http:HttpClient, private route: ActivatedRoute, private router: Router, private dataService: DataService, private alertController: AlertController) { }

  ngOnInit() {
    this.proj_id = this.dataService.getID();
  }
  

  login(){
    this.http.post(this.SERVER_ADDRESS+`/user/login`,{
      email: this.user.email,
      password : this.user.password
    }).subscribe((response)=> {
      console.log(response);
      if(response[`login`] === 'success'){
        this.http.post(this.SERVER_ADDRESS + '/attend/member',{
          proj_id: this.proj_id,
          user_id: this.user.email
        }).subscribe((res) => {
          console.log(res);
            if(res['attend'] === 'success'){
              this.alertController.create({
                header: 'Confirm!',
                subHeader: '프로젝트 참가 성공!',
                message: '로그인 화면으로 이동합니다',
                buttons: [{
                  text: '확인',
                  handler:() =>{
                    this.router.navigateByUrl('http://localhost:8100/login');
                  }
                }]
              }).then(alert=>{
                alert.present();
              });
            }
        })
      }
    })
  }


}
