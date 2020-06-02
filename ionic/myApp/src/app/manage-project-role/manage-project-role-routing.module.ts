import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageProjectRolePage } from './manage-project-role.page';

const routes: Routes = [
  {
    path: '',
    component: ManageProjectRolePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageProjectRolePageRoutingModule {}
