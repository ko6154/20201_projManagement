import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteListPage } from './invite-list.page';

const routes: Routes = [
  {
    path: '',
    component: InviteListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteListPageRoutingModule {}
