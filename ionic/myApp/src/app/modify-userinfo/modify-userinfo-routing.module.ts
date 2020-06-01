import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyUserinfoPage } from './modify-userinfo.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyUserinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyUserinfoPageRoutingModule {}
