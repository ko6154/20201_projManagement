import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-invite-list',
  templateUrl: './invite-list.page.html',
  styleUrls: ['./invite-list.page.scss'],
})
export class InviteListPage {
  invitations: Array<{}> = [];
  user_id: string;
  proj_name: string;

  constructor(
    private http: HttpService,
    private storage: StorageService,
    private navCtrl : NavController,
    private alertCtrl: AlertController,
	private menu: MenuController,
    private dataService : DataService
  ) { }
  ionViewWillEnter(){
    this.initialize();
  }

  async initialize() {
	await this.storage.get_uid()
    .then(val => {
      this.user_id = val;
    });
	
	

	await this.http.get_invitations(this.user_id).then(
      (res: any[]) => {
        let tmp_invitations: Array<{}> = [];
        res.forEach(function (value) {
		  tmp_invitations.push({
            proj_id: value["PROJ_ID"],
			proj_name: '',
			send_id: value["SEND_USER_ID"],
			isPM: value["ISPM"]
		  });
		});
		this.invitations = tmp_invitations;
	  },
	  error=>{
        console.log(error);
      }
    );
	
	for(let i = 0; i < this.invitations.length; ++i){
		await this.http.get_projectname((this.invitations[i]["proj_id"])).then(
			(res: any[]) => {
				var temp_proj_name;
				res.forEach(function (value) {
					temp_proj_name = value["PROJ_NAME"];
				});
				this.invitations[i]["proj_name"] = temp_proj_name;
			},
			error => {
				console.log(error);
			}
		);
	}
	
  }

  goBack(){
  	  this.navCtrl.pop();
  }

  acceptInvite(invitation){
	this.http.accept_invite(invitation.proj_id, this.user_id, invitation.isPM).subscribe(
	  res => {
        if(res["accept"] === "success"){
          this.alertCtrl.create({
            header: '수락 성공',
            message: '프로젝트 초대를 수락하였습니다.',
            buttons: [{
              text: '확인',
              handler:() =>{
                this.initialize();
              }
            }]
          }).then(alert=>{
            alert.present();
          });
        }else if(res["accept"] === "deny"){
          this.alertCtrl.create({
            header: '수락 실패',
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
  rejectInvite(invitation){
	this.http.reject_invite(invitation.proj_id, this.user_id).subscribe(
	  res => {
        if(res["reject"] === "success"){
          this.alertCtrl.create({
            header: '초대 거절',
            message: '프로젝트 초대를 거절하였습니다.',
            buttons: [{
              text: '확인',
              handler:() =>{
                this.initialize();
              }
            }]
          }).then(alert=>{
            alert.present();
          });
        }else if(res["reject"] === "fail"){
          this.alertCtrl.create({
            header: '거절 실패',
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
