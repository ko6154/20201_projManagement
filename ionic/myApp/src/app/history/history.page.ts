﻿import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service'
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service'
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage{
  projects: Array<{}> = [];
  constructor(
	private httpService : HttpService,
    private storage : StorageService,
    private navCtrl : NavController,
    private dataService: DataService,
    private alertController : AlertController,
	private menu: MenuController,
	public toastController: ToastController
  ) { }

  ishidden = false;

  search = {
      user_id:'',
      mgr_id:'',
      start_date:'',
      end_date:'',
    }
  sdate: string;
  edate: string;

  async initalize() {
    await this.storage.get_uid()
    .then(val => {
      this.search.user_id = val;
    });

    this.httpService.get_done_project_list(this.search.user_id).subscribe(
      (res: any[])  => {
        let tmp_projects: Array<{}> = [];
        res.forEach(function (value){
          let start = value["PROJ_START"];
          let end = value["PROJ_END"];
          start = start.substr(0,10);
          end = end.substr(0,10);
          tmp_projects.push({
            id: value["PROJ_ID"],
            name: value["PROJ_NAME"],
            progress: value["PROJ_PROGRESS"],
            start: start,
            end: end,
            desc: value["PROJ_DESC"],
            mgr_id: value["PROJ_MGR_UID"],
            proj_url: value["PROJ_URL"],
            progress_status: ''
          });
        });
        this.projects = tmp_projects;

        this.setProgressStatus();
      }
    );
  }

  hideSearchBox() {
    let ishidden = false;
    this.ishidden = (this.ishidden)? false:true;
  }

  search_project(){
    
    this.sdate = this.search.start_date;
    this.edate = this.search.end_date;

    this.search.start_date = this.search.start_date.substr(0,10);
    this.search.end_date = this.search.end_date.substr(0,10);
    
    this.httpService.search_history(this.search.user_id,this.search.mgr_id,this.search.start_date,this.search.end_date).subscribe(
      (res: any[])  => {
        let tmp_projects: Array<{}> = [];
        res.forEach(function (value){
          let start = value["PROJ_START"];
          let end = value["PROJ_END"];
          start = start.substr(0,10);
          end = end.substr(0,10);
          tmp_projects.push({
            id: value["PROJ_ID"],
            name: value["PROJ_NAME"],
            progress: value["PROJ_PROGRESS"],
            start: start,
            end: end,
            desc: value["PROJ_DESC"],
            mgr_id: value["PROJ_MGR_UID"],
            proj_url: value["PROJ_URL"],
            progress_status: ''
          });
        });
        this.projects = tmp_projects;

        this.setProgressStatus();
      }
	);
  }

  ionViewWillEnter(){
    this.initalize();
  }

  setProgressStatus(){
    for(var i=0; i<this.projects.length; ++i){
      let start = Date.parse(this.projects[i]['start']);
      let end = Date.parse(this.projects[i]['end']);
      let progress = this.projects[i]['progress'];
      let now = new Date().getTime();
      let dateRate = ((now-start) / (end-start)) *100;
      console.log(dateRate-progress);
      if(dateRate >= 100){
        this.projects[i]['progress_status'] = 'l1';    // dark red
      }else if(dateRate-progress >= 60) {
        this.projects[i]['progress_status'] = 'l2';     // red
      }else if(dateRate-progress >= 40) {
        this.projects[i]['progress_status'] = 'l3';   // dark yellow
      }else if(dateRate-progress >= 20) {
        this.projects[i]['progress_status'] = 'l4';   // yellow
      }else if(dateRate-progress >= -10){
        this.projects[i]['progress_status'] = 'l5';     // white
      }else {
        this.projects[i]['progress_status'] = 'l6';     // green
      }
    }
  }

  project_click(project){
    this.dataService.setProjectID(project.id);
    console.log(project.id);
    this.dataService.setManagerID(project.mgr_id);
    this.dataService.setProjectName(project.name);
    this.dataService.setAttendLink(project.proj_url);
    this.navCtrl.navigateForward("/task-list");
  }
  
  goBack(){
  	  this.navCtrl.pop();
  }
}
