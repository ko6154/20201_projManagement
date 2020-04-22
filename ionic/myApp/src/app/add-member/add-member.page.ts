import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
})
export class AddMemberPage{
  project_id: string;
  project_name: string;
  invite_me_id: string;
  invite_you_id: string;
  isPM: number;
  user_id: string;
  ttt: string;
  project_creater: string;

  members: Array<{}> = [];
  inviting_members: Array<{}> = [];

  invite_info = {
    proj_id: '',
    send_id: '',
    recv_id: '',
	isPM: false,
  }

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
	this.project_id = this.dataService.getProjectID();
	this.project_name = this.dataService.getProjectName();
	this.project_creater = this.dataService.getManagerID();
	this.invite_info.proj_id = this.project_id;

	await this.storage.get_uid()
    .then(val => {
      this.user_id = val;
    });

	this.invite_info.send_id = this.user_id;

	this.http.get_isPM(this.project_id, this.user_id).subscribe(
		(res: any[]) => {
			let temp_isPM: number;
			res.forEach(function (value){
				temp_isPM = value["ISPM"];
			});
			this.isPM = temp_isPM;
		}
	);

	this.http.get_project_members(this.project_id).subscribe(
      (res: any[]) => {
        let tmp_members: Array<{}> = [];
        res.forEach(function (value) {
          tmp_members.push({
            user_id: value["USER_ID"],
			isPM: value["ISPM"]
		  });
		});
		this.members = tmp_members;
	  },
	  error=>{
        console.log(error);
      }
    );

	this.http.get_project_inviting_members(this.project_id).subscribe(
      (res: any[]) => {
        let tmp_members: Array<{}> = [];
        res.forEach(function (value) {
          tmp_members.push({
            recv_user_id: value["RECV_USER_ID"]
		  });
		});
		this.inviting_members = tmp_members;
	  },
	  error=>{
        console.log(error);
      }
    );
  }

  goBack(){
  	  this.navCtrl.pop();
  }

  invite() {
	this.http.invite(this.invite_info).subscribe(
	  res => {
        if(res["invite"] === "success"){
          this.alertCtrl.create({
            header: '초대 성공',
            message: '성공적으로 초대되었습니다.',
            buttons: [{
              text: '확인',
              handler:() =>{
                this.initialize();
              }
            }]
          }).then(alert=>{
            alert.present();
          });
        }else if(res["invite"] === "deny"){
          this.alertCtrl.create({
            header: '초대 실패',
            message: '잠시후 다시 시도해주세요.',
            buttons: [{
              text: '확인'
            }]
          }).then(alert=>{
            alert.present();
          });
        }
		else{
		  this.alertCtrl.create({
            header: '초대 실패',
            message: '해당 유저가 존재하지 않습니다.',
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

  cancelInvite(member) {
	this.http.cancel_invite(this.project_id, member.recv_user_id).subscribe(
	  res => {
        if(res["cancel"] === "success"){
          this.alertCtrl.create({
            header: '초대 취소',
            message: '성공적으로 취소되었습니다.',
            buttons: [{
              text: '확인',
              handler:() =>{
                this.initialize();
              }
            }]
          }).then(alert=>{
            alert.present();
          });
        }else if(res["cancel"] === "fail"){
          this.alertCtrl.create({
            header: '초대 취소 실패',
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
