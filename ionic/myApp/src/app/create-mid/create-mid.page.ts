import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-create-mid',
  templateUrl: './create-mid.page.html',
  styleUrls: ['./create-mid.page.scss'],
})
export class CreateMidPage implements OnInit{
  uploadForm: FormGroup;
  attaches = new Set();

  post_bigs: Array<{}> = [];

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
    this.storage.get_uid().then(val => {
      this.author = val;
    });
    this.projectID = this.dataService.getProjectID();

    this.formData = new FormData();
  }

  ngOnInit() {

    this.uploadForm = this.formBuilder.group({
      BigID: new FormControl(),
      MidTitle: new FormControl(),
      MidLevel: new FormControl(),
      MidStart: new FormControl(),
      MidEnd: new FormControl(),
      MidDesc: new FormControl(),
      userFiles: new FormControl([''])
    });


    this.http.get_task_big_list(this.projectID).subscribe(
      (res: any[])  => {
        let tmp_post_big: Array<{}> = [];
        res.forEach(function (value){
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
    let files : FileList;
    files = $event.srcElement.files;
    for(let i=0; i<files.length; ++i){
      this.attaches.add(files[i]);
    } 
  }

  sdate: string;
  edate: string;
  create_task(){

    let original_names = "";
    this.attaches.forEach((file : File)=>{
      this.formData.append('userFiles', file, file.name);
      original_names += file.name+"*";
    });

    this.formData.set('ProjectID', this.projectID);
    this.formData.set('BigID', this.uploadForm.get('BigID').value);
    this.formData.set('MidLevel', this.uploadForm.get('MidLevel').value);
    this.formData.set('MidTitle', this.uploadForm.get('MidTitle').value);
    this.formData.set('MidDesc', this.uploadForm.get('MidDesc').value);    
    this.formData.set('MidAuthor', this.author);
    this.formData.set('MidAttach', original_names);

    this.http.create_mid_task(this.formData).then(
      ret => {
        
        if (ret['create'] == 'success') {
            this.alertController.create({
              header: 'Confirm!',
              subHeader: '작업 추가 성공!',
              message: '업무리스트로 이동합니다.',
              buttons: [{
                text: '확인',
                handler: () => {
                  this.navCtrl.navigateForward('/task');
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
      }
    );
  }

  delFile(file: any){
    this.attaches.delete(file);
  }
}
