import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageMemberPageRoutingModule } from './manage-member-routing.module';

import { ManageMemberPage } from './manage-member.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageMemberPageRoutingModule
  ],
  declarations: [ManageMemberPage]
})
export class ManageMemberPageModule {}
