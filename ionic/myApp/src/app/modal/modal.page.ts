import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpService } from '../http_service_module/http.service';
import { DataService } from '../services/data.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private navCtrl : NavController,
    private httpService : HttpService,
  ) { }
  
  @Input() public projectName: string;
  @Input() public projectId: string;

   projects: Array<{}> = [];
  ionViewWillEnter(){
    this.ngOnInit();
  }
  ngOnInit() {
    this.httpService.get_project(this.projectId).subscribe(
      (res: any[])  => {
        let tmp_projects: Array<{}> = [];
        res.forEach(function (value){
          let start = value["PROJ_START"];
          let end = value["PROJ_END"];
          let deadline = value["PROJ_END"];
          start = start.substr(0,10) + " " +start.split('T')[1].substr(0,5);
          end = end.substr(0,10) + " " +end.split('T')[1].substr(0,5);
          deadline = end.substr(0,10);
          tmp_projects.push({
            id: value["PROJ_ID"],
            name: value["PROJ_NAME"],
            progress: value["PROJ_PROGRESS"],
            status: value["PROJ_STATUS"],
            start: start,
            end: end,
            desc: value["PROJ_DESC"],
            mgr_id: value["PROJ_MGR_UID"],
            proj_url: value["PROJ_URL"],
            progress_status: '',
            deadline: deadline
          });
        });
        this.projects = tmp_projects;
      }
    )
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  project_click(){
    this.dataService.setProjectID(this.projects[0]["id"]);
    this.dataService.setManagerID(this.projects[0]["mgr_id"]);
    this.dataService.setProjectName(this.projects[0]["name"]);
    this.dataService.setAttendLink(this.projects[0]["proj_url"]);
    this.closeModal();
    this.navCtrl.navigateForward("/detail/noti");
  }
}
