import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
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
  constructor(
    public platfrom: Platform,
    private httpService : HttpService,
    private storage : StorageService,
    private navCtrl : NavController,
    private dataService: DataService,
	  private menu: MenuController,
	  public toastController: ToastController
  ) {}

  ionViewWillEnter(){
    this.initalize();
  }
  async initalize() {
    await this.storage.get_uid()
    .then(val => {
      this.user_id = val;
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
  }
  goMain(){
    this.navCtrl.navigateForward("/main");
  }
  goHistory(){
    this.navCtrl.navigateForward("/history");
  }
}
