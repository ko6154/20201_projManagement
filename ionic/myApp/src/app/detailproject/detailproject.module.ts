
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailprojectPageRoutingModule } from './detailproject-routing.module';

import { DetailprojectPage } from './detailproject.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailprojectPageRoutingModule
  ],
  declarations: [DetailprojectPage]
})
export class DetailprojectPageModule {}
