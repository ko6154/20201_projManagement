import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageMemberPage } from './manage-member.page';

const routes: Routes = [
  {
    path: '',
    component: ManageMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageMemberPageRoutingModule {}
