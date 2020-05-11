import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhiteboardPage } from './whiteboard.page';

const routes: Routes = [
  {
    path: '',
    component: WhiteboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhiteboardPageRoutingModule {}
