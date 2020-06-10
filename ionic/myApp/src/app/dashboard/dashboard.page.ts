import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page'; 

declare var google;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  projects: Array<{}> = [];
  ongoingProjects: Array<{}> = [];
  doneProjects: Array<{}> = [];
  user_id : string;
  ongoingCnt : number;
  doneCnt : number;
  cancelCnt : number;
  userName: string;
  flag: boolean;

  constructor(
    public platfrom: Platform,
    private httpService : HttpService,
    private storage : StorageService,
    private navCtrl : NavController,
    private dataService: DataService,
    private menu: MenuController,
    public toastController: ToastController,
    private modalController: ModalController
  ) {}

  async openModal(projectId: string, projectName: string) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        projectName: projectName,
        projectId: projectId
      }
    });
    return await modal.present();
  }

  ionViewWillEnter(){
    this.initalize();
  }
  async initalize() {
    this.flag = false;
    await this.storage.get_uid()
    .then(val => {
      this.user_id = val;
    });

    await this.storage.get_name()
    .then(val => {
      this.userName = val;
    });

    this.httpService.get_allproj(this.user_id).subscribe(
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
        for(var i = 0; i < this.ongoingProjects.length; i++){
          this.ongoingProjects.pop();
        }
        for(var i = 0; i < this.doneProjects.length; i++){
          this.doneProjects.pop();
        }
        for(var i = 0; i < this.projects.length; i++){
          if(this.projects[i]["status"] == 0) {
            this.ongoingProjects.push(this.projects[i]);
          }
          else if(this.projects[i]["status"] == 1) {
            this.doneProjects.push(this.projects[i]);
          }
        }
      }
    )

    await this.platfrom.ready().then(() => {
      google.charts.load('current', {'packages':['corechart']});
      this.DrawPieChart();
    })

    
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '로그아웃 되었습니다.',
      duration: 2000,
	  color: 'dark'
    });
    toast.present();
  }

  DrawPieChart() {
    this.ongoingCnt = 0;
    this.doneCnt = 0;
    this.cancelCnt = 0;
    for(var i = 0; i < this.projects.length; i++) {
      if(this.projects[i]["status"] == 0) {
        this.ongoingCnt++;
      }
      else if(this.projects[i]["status"] == 1) {
        this.doneCnt++;
      }
      else if(this.projects[i]["status"] == -1) {
        this.cancelCnt++;
      }
    }
    var data = google.visualization.arrayToDataTable([
      ['vehicle status', 'count'],
      ['완료', this.doneCnt],
      ['진행중', this.ongoingCnt],
      ['취소됨', this.cancelCnt],
      ['지연', 0]
    ]);
    var options = {
      //title: 'Vehicle Count according to their status',
      is3D: false
    }
    var chart = new google.visualization.PieChart(document.getElementById('div_pie'));
    chart.draw(data, options);
    this.flag = true;
  }
  goMain(){
    this.navCtrl.navigateForward("/main");
  }
  goHistory(){
    this.navCtrl.navigateForward("/history");
  }
  goInviteList(){
    this.navCtrl.navigateForward("/invite-list");
  }
  goCheckPassword() {
    this.navCtrl.navigateForward("/check-password");
  }
  logout(){
    this.presentToast();
      this.storage.del_uid();
      this.storage.del_pw();
      this.storage.del_name();
      this.navCtrl.navigateForward("/home");
    }
    openCustom() {
      this.menu.enable(true, 'first');
        this.menu.open('first');
      }
      goGenerateProject(){
        this.navCtrl.navigateForward("/generate-project");
      }
}
