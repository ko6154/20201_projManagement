import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-attend-project',
  templateUrl: './attend-project.page.html',
  styleUrls: ['./attend-project.page.scss'],
})
export class AttendProjectPage implements OnInit {

data: any;
proj_information: any;
SERVER_ADDRESS: string = "http://52.55.31.29:3000";
  project_id:string;
  project_name: string;
  project_mgr_uid: string;
  project_desc: string;


  constructor(private route: ActivatedRoute, private router:Router, private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {
    if(this.route.snapshot.data['attend_code']){
        this.data = this.route.snapshot.data['attend_code'];
        this.http.get(this.SERVER_ADDRESS+`/projectInfo/select?proj_url=${this.data}`).toPromise().then((response)=>{
          console.log(response);
          this.project_id = response['PROJ_ID'];
          this.project_name = response['PROJ_NAME'];
          this.project_mgr_uid = response['PROJ_MGR_UID'];
          this.project_desc = response['PROJ_DESC'];
          console.log(this.project_id);
          console.log(this.project_name);
          console.log(this.project_desc);
          console.log(this.project_desc);
        });
        console.log(this.project_id);
        console.log(this.project_name);
        console.log(this.project_desc);
        console.log(this.project_desc);
    }
  }

  goMainPage(){
    this.dataService.setID(this.project_id);
    this.router.navigateByUrl(`/login-page/`);
  }

}
