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
  }

  setFiles($event) {
    let files: FileList;
    files = $event.srcElement.files;
    for (let i = 0; i < files.length; ++i) {
      this.attaches.add(files[i]);
    }
  }

  sdate: string;
  edate: string;
  create_task() {
    let start: string, end: string, created: string;
    this.sdate = start = this.uploadForm.get('SmlStart').value;
    start = start.substr(0, 10) + " " + start.split('T')[1].substr(0, 8);
    this.edate = end = this.uploadForm.get('SmlEnd').value;
    end = end.substr(0, 10) + " " + end.split('T')[1].substr(0, 8);
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
    this.formData.set('SmlStart', start);
    this.formData.set('SmlEnd', end);
    this.formData.set('SmlDesc', this.uploadForm.get('SmlDesc').value);
    this.formData.set('SmlStatus', '0');
    this.formData.set('SmlAuthor', this.author);
    this.formData.set('SmlCreated', created);
    this.formData.set('SmlAttach', original_names);
    this.formData.set('SmlWeight', this.uploadForm.get('SmlWeight').value);
    let valid = this.uploadForm.get('SmlWeight').value  // 중요도 값이 정상 범위가 아닌 경우 5로 설정.
    if(valid < 1 || valid > 10){
      this.formData.set('SmlWeight', '5');
    }

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
                this.uploadForm.setValue({'SmlStart': this.sdate});
                this.uploadForm.setValue({'SmlEnd': this.edate});
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
    
    this.alertController.create({
      header: 'Reject!',
      subHeader: '종료 날짜 오류',
      message: '종료 날짜는 시작 날짜보다 이후여야 합니다',
      buttons: [{
        text: '확인',
        handler:()=>{
          this.uploadForm.setValue({'SmlStart': ''});
          this.uploadForm.setValue({'SmlEnd': ''});
        }
      }]
    }).then(alert => {
      alert.present();
    });
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


}
