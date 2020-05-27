import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailprojectPage } from './detailproject.page';

const routes: Routes = [
  {
    path: 'detailproject',
    component: DetailprojectPage,
    children: [
      {
        path: 'noti',
        children: [
          {
            path: '',
            loadChildren: '../noti/noti.module#NotiModule'
          }
        ]
      },
      {
        path: 'task',
        children: [
          {
            path: '',
            loadChildren: '../task/task.module#TaskModule'
          }
        ]
      },
      {
        path: 'whiteboard',
        children: [
          {
            path: '',
            loadChildren: '../whiteboard/whiteboard.module#WhiteboardModule'
          }
        ]
      },
      {
        path: 'detail',
        redirectTo: '/detailproject/noti',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailprojectPageRoutingModule {}
