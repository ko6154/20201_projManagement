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
	
	this.http.get_invitations(this.user_id).subscribe(
      (res: any[]) => {
        let tmp_invitations: Array<{}> = [];
        res.forEach(function (value) {
          tmp_invitations.push({
            proj_id: value["PROJ_ID"],
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
  }

  goBack(){
  	  this.navCtrl.pop();
  }


}
