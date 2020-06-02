import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageProjectRolePageRoutingModule } from './manage-project-role-routing.module';

import { ManageProjectRolePage } from './manage-project-role.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageProjectRolePageRoutingModule
  ],
  declarations: [ManageProjectRolePage]
})
export class ManageProjectRolePageModule {}
