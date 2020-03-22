import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendProjectPageRoutingModule } from './attend-project-routing.module';

import { AttendProjectPage } from './attend-project.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendProjectPageRoutingModule
  ],
  declarations: [AttendProjectPage]
})
export class AttendProjectPageModule {}
