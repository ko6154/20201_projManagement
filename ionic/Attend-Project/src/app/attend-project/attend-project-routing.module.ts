import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendProjectPage } from './attend-project.page';

const routes: Routes = [
  {
    path: '',
    component: AttendProjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendProjectPageRoutingModule {}
