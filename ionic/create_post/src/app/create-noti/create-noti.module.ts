import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNotiPage } from './create-noti.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNotiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateNotiPage]
})
export class CreateNotiPageModule {}
