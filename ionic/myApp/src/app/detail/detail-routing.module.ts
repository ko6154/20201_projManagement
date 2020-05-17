import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPage } from './detail.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPage,
    children: [
      {
        path: 'noti',
        children:
          [
            {
              path: '',
              loadChildren: '../noti/noti.module#NotiPageModule'
            }
          ]
      },
      {
        path: 'task',
        children:
          [
            {
              path: '',
              loadChildren: '../task/task.module#TaskPageModule'
            }
          ]
      },
      {
        path: 'whiteboard',
        children:
          [
            {
              path: '',
              loadChildren: '../whiteboard/whiteboard.module#WhiteboardPageModule'
            }
          ]
      },
      {
        path: '',
        redirectTo: '/detail/noti',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'detail',
    redirectTo: '/detail/noti',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPageRoutingModule {}
