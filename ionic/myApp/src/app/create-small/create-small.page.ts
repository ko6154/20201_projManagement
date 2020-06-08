import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-create-small',
  templateUrl: './create-small.page.html',
  styleUrls: ['./create-small.page.scss'],
})
export class CreateSmallPage implements OnInit {
  uploadForm: FormGroup;
  attaches = new Set();

  post_bigs: Array<{}> = [];
  post_mids: Array<{}> = [];
  post_members: Array<{}> = [];

  author: string;
  projectID: string;

  formData: FormData;
  constructor(
    private http: HttpService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private storage: StorageService,
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    storage.get_uid().then(val => {
      this.author = val;
    });
    this.projectID = this.dataService.getProjectID();

    this.formData = new FormData();
  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      BigID: new FormControl(),
      MidID: new FormControl(),
      SmlTitle: new FormControl(),
      SmlStart: new FormControl(),
      SmlEnd: new FormControl(),
      SmlWeight : new FormControl(),
      SmlDesc: new FormControl(),
      MemberList : new FormControl(),
      userFiles: new FormControl([''])
    });
    
    this.http.get_task_big_list(this.projectID).subscribe(
      (res: any[]) => {
        let tmp_post_big: Array<{}> = [];
        res.forEach(function (value) {
          tmp_post_big.push({
            BigID: value["BIG_ID"],
            level: value["BIG_LEVEL"],
            title: value["BIG_TITLE"]
          });
        });
        this.post_bigs = tmp_post_big;
      }
    );

    this.http.get_task_member_list(this.projectID).subscribe(
      (res: any[]) => {
        let tmp_post_members: Array<{}> = [];
        res.forEach(function (value) {
          tmp_post_members.push({
            UserID: value["USER_ID"]
          });
        });
        this.post_members = tmp_post_members;
      }
    );
  }



  setFiles($event) {
    let files: FileList;
    files = $event.srcElement.files;
    for (let i = 0; i < files.length; ++i) {
      this.attaches.add(files[i]);
    }
  }


  create_task() {
    let created: string;
    let now = new Date().toISOString();
    created = now.substr(0, 10) + " " + now.split('T')[1].substr(0, 8);

    let original_names = "";
    this.attaches.forEach((file: File) => {
      this.formData.append('userFiles', file, file.name);
      original_names += file.name + "*";
    });

    this.formData.set('ProjectID', this.projectID);
    this.formData.set('BigID', this.uploadForm.get('BigID').value);
    this.formData.set('MidID', this.uploadForm.get('MidID').value);
    this.formData.set('SmlTitle', this.uploadForm.get('SmlTitle').value);
    this.formData.set('SmlDesc', this.uploadForm.get('SmlDesc').value);
    this.formData.set('SmlStatus', '0');
    this.formData.set('SmlAuthor', this.author);
    this.formData.set('SmlCreated', created);
    this.formData.set('SmlAttach', original_names);
    this.formData.set('SmlActor',this.uploadForm.get('MemberList').value);

    this.http.create_sml_task(this.formData).then(
      ret => {
        if (ret['create'] == 'success') {
          this.alertController.create({
            header: 'Confirm!',
            subHeader: '작업 추가 성공!',
            message: '업무리스트로 이동합니다.',
            buttons: [{
              text: '확인',
              handler: () => {
                this.navCtrl.navigateForward('/detail/task');
              }
            }]
          }).then(alert => {
            alert.present();
          });
        } else {
          this.alertController.create({
            header: 'Reject!',
            subHeader: '작업 추가 실패',
            message: '잠시후 다시 시도해주세요.',
            buttons: [{
              text: '확인',
              handler: () => {
                this.formData.delete('userFiles');
              }
            }]
          }).then(alert => {
            alert.present();
          });
        }
      });
  }

  getMidList() {
    var BigID = this.uploadForm.get('BigID').value;
    this.http.get_task_mid_list(BigID).subscribe(
      (res: any[]) => {
        console.log(res);
        let tmp_post_mid: Array<{}> = [];
        res.forEach(function (value) {
          console.log(value);
          tmp_post_mid.push({
            MidID: value["MID_ID"],
            level: value["MID_LEVEL"],
            title: value["MID_TITLE"],
            status: value["MID_STATUS"]
          });
          if(tmp_post_mid[tmp_post_mid.length-1]['status'] == '1')
            tmp_post_mid.pop();
        });
        this.post_mids = tmp_post_mid;
      }
    );
  }

  date_validate() : boolean{
    let valid = this.uploadForm.get('SmlStart').value < this.uploadForm.get('SmlEnd').value;
    console.log("vaild: " +valid)

    if(valid)
      return valid;
    
  }

  customAlertPostBig: any = {
    header: '대분류',
    subHeader: '대분류를 선택하세요',
    message: '',
    translucent: true
  };

  customAlertPostMiddle: any = {
    header: '중분류',
    subHeader: '중분류를 선택하세요',
    message: '',
    translucent: true
  };

  delFile(file: any){
    this.attaches.delete(file);
  }

  goBack(){
    this.navCtrl.pop();
  }
}
