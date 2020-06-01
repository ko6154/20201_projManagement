import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyUserinfoPageRoutingModule } from './modify-userinfo-routing.module';

import { ModifyUserinfoPage } from './modify-userinfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyUserinfoPageRoutingModule
  ],
  declarations: [ModifyUserinfoPage]
})
export class ModifyUserinfoPageModule {}
