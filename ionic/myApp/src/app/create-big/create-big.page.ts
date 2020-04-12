import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../services/data.service'
@Component({
  selector: 'app-create-big',
  templateUrl: './create-big.page.html',
  styleUrls: ['./create-big.page.scss'],
})

export class CreateBigPage implements OnInit{
  uploadForm: FormGroup;
  attaches = new Set();

  author: string;
  projectID: string;

  formData : FormData;
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

  ngOnInit(){
    this.uploadForm = this.formBuilder.group({
      BigTitle: new FormControl(),
      BigLevel: new FormControl(),
      BigStart: new FormControl(),
      BigEnd: new FormControl(),
      BigWeight: new FormControl(),
      BigDesc: new FormControl(),
      userFiles: new FormControl([''])
    });
  }

  setFiles($event) {
    console.log($event);
    let files : FileList;
    files = $event.srcElement.files;
    for(let i=0; i<files.length; ++i){
      this.attaches.add(files[i]);
    } 
  }

  sdate: string;
  edate: string;
  create_task() {    
    let start:string, end:string, created:string;
    this.sdate = start = this.uploadForm.get('BigStart').value;
    start = start.substr(0, 10) + " " + start.split('T')[1].substr(0, 8);
    this.edate = end = this.uploadForm.get('BigEnd').value;
    end = end.substr(0, 10) + " " + end.split('T')[1].substr(0, 8);
    let now = new Date().toISOString();
    created = now.substr(0, 10) + " " + now.split('T')[1].substr(0, 8);

    let original_names = "";
    this.attaches.forEach((file : File)=>{
      this.formData.append('userFiles', file, file.name);
      original_names += file.name+"*";
    });
    
    this.formData.set('ProjectID', this.projectID);
    this.formData.set('BigAuthor', this.author);
    this.formData.set('BigStatus', '0');
    this.formData.set('BigProgress', '0');
    this.formData.set('BigTitle', this.uploadForm.get('BigTitle').value);
    this.formData.set('BigLevel', this.uploadForm.get('BigLevel').value);
    this.formData.set('BigStart', start);
    this.formData.set('BigEnd', end);
    this.formData.set('BigWeight', this.uploadForm.get('BigWeight').value);
    this.formData.set('BigDesc', this.uploadForm.get('BigDesc').value);
    this.formData.set('BigCreated', created);
    this.formData.set('BigAttach', original_names);
    
    this.http.create_big_task(this.formData).then(
      ret => {
        console.log(ret['create']);
        if (ret['create'] == 'success') {
            this.alertController.create({
              header: 'Confirm!',
              subHeader: '작업 추가 성공!',
              message: '업무리스트로 이동합니다.',
              buttons: [{
                text: '확인',
                handler: () => {
                  this.navCtrl.navigateForward('/task-list');
                }
              }]
            }).then(alert => {
              alert.present();
            });
        } else {
          this.alertController.create({
            header: 'Reject!',
            subHeader: '작업 추가 실패',
            message: '입력값을 확인해주세요.',
            buttons: [{
              text: '확인',
              handler: () => {
                this.formData.delete('userFiles');
                this.formData.set('BidStart', this.sdate);
                this.formData.set('BidEnd', this.edate);
              }
            }]
          }).then(alert => {
            alert.present();
          });
        }
      });
  }

  date_validate() : boolean{
    let valid = this.uploadForm.get('BigStart').value < this.uploadForm.get('BigEnd').value;
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
          this.formData.set('BigStart', '');
          this.formData.set('BigEnd', '');
        }
      }]
    }).then(alert => {
      alert.present();
    });
  }

  delFile(file: any){
    this.attaches.delete(file);
  }

}
