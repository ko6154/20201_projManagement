import { Component } from '@angular/core';
import { HttpService } from '../http_service_module/http.service';
import { StorageService } from '../storage_service_module/storage.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-detailproject',
  templateUrl: './detailproject.page.html',
  styleUrls: ['./detailproject.page.scss'],
})
export class DetailprojectPage {
 
  constructor(
    private http: HttpService,
    private storage: StorageService,
    private navCtrl : NavController,
    private alertCtrl: AlertController,
	  private menu: MenuController,
    private dataService : DataService
  ) {}

 
  
}
