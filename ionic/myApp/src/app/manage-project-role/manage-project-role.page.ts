import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-manage-project-role',
  templateUrl: './manage-project-role.page.html',
  styleUrls: ['./manage-project-role.page.scss'],
})
export class ManageProjectRolePage {
  emptyString: "";
  userId: string;

  isPM: boolean;
  projectId: string;
  projectName: string;

  members: Array<{}> = [];

  constructor(
    private http: HttpService,
    private storage: StorageService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private menu: MenuController,
    private dataService: DataService,
    public alertController: AlertController
  ) { }

  ionViewWillEnter() {
    this.initailize();
  }

  async initailize() {
    this.projectId = this.dataService.getProjectID();
    this.projectName = this.dataService.getProjectName();

    await this.storage.get_uid()
      .then(val => {
        this.userId = val;
      });

    this.http.get_isPM(this.projectId, this.userId).subscribe(
      (res: any[]) => {
        let temp_isPM: boolean;
        res.forEach(function (value) {
          temp_isPM = value["ISPM"];
        });
        this.isPM = temp_isPM;
      }
    );

    this.http.get_project_members(this.projectId).subscribe(
      (res: any[]) => {
        let tmp_members: Array<{}> = [];
        res.forEach(function (value) {
          tmp_members.push({
            userId: value["USER_ID"],
            role: value["ATTENDENCE_ROLE"],
            name: value["NAME"],
            isPM: value["ISPM"],
            newRole: ""
          });
        });
        this.members = tmp_members;
      },
      error => {
        console.log(error);
      }
    );

  }

  goBack() {
    this.navCtrl.pop();
  }

  updateUserRole(projectId: string, userId: string, newRole: string) {
    this.http.modify_role(projectId, userId, newRole).subscribe(
      res => {
        if(res["modify"] === "success"){
          this.alertController.create({
            header: "성공",
            message: "역할이 수정되었습니다.",
            buttons: [{
              text: '확인',
              handler:() =>{
                this.initailize();
              }
            }]
          }).then(alert=>{
            alert.present();
          })
        }else{
			
		  
        }
      },
      error => {
		
      }
    );
  }
}
