import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http'
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ]
})
export class HttpServiceModule { }
