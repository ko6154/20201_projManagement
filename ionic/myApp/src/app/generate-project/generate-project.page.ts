import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { StorageService } from '../storage_service_module/storage.service' 

@Component({
  selector: 'app-generate-project',
  templateUrl: './generate-project.page.html',
  styleUrls: ['./generate-project.page.scss'],
})
export class GenerateProjectPage {
  
 constructor(
   private http: HttpService,
   private alertController : AlertController,
   private navCtrl: NavController,
   private storage: StorageService
   ) {storage.get_uid().then(val=>{
    this.project.user_id = val
    });
  }

   project = {
     mgr_id:'',
     user_id:'',
     title:'',
     start_date:'',
     end_date:'',
     desc:''
   }
   sdate: string;
   edate: string;

   generate_project(){
    this.sdate = this.project.start_date;
    this.edate = this.project.end_date;

    this.project.mgr_id = this.project.user_id;
    this.project.start_date = this.project.start_date.substr(0,10) + " " +this.project.start_date.split('T')[1].substr(0,8);
    this.project.end_date = this.project.end_date.substr(0,10) + " " +this.project.end_date.split('T')[1].substr(0,8);
    this.http.generate_project(this.project).subscribe(
      res => {
        if(res["create"] === "success"){
          console.log("create project success");
          this.alertController.create({
            header: 'Confirm!',
            subHeader: '프로젝트 추가 성공!',
            message: '메인 화면으로 이동합니다.',
            buttons: [{
              text: '확인',
              handler:() =>{
                this.navCtrl.pop();
                this.navCtrl.navigateForward('/main');
              }
            }]
          }).then(alert=>{
            alert.present();
          });

        }else{
          this.alertController.create({
            header: 'Reject!',
            subHeader: '프로젝트 추가 실패',
            message: '입력 값을 확인해주세요.',
            buttons: [{
              text: '확인',
              handler:()=>{
                this.project.start_date = this.sdate;
                this.project.end_date = this.edate;
              }
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

   goBack(){
  	  this.navCtrl.pop();
  }
 
 
}
