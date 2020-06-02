import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  { path: 'main', loadChildren: () => import('./main/main.module').then( m => m.MainPageModule) },
  { path: 'task-list', loadChildren: './task-list/task-list.module#TaskListPageModule' },
  { path: 'generate-project', loadChildren: './generate-project/generate-project.module#GenerateProjectPageModule' },
  { path: 'create-big', loadChildren: './create-big/create-big.module#CreateBigPageModule' },
  { path: 'create-mid', loadChildren: './create-mid/create-mid.module#CreateMidPageModule' },
  { path: 'create-small', loadChildren: './create-small/create-small.module#CreateSmallPageModule' },
  { path: 'add-member', loadChildren: './add-member/add-member.module#AddMemberPageModule' },
  { path: 'board', loadChildren: './board/board.module#BoardPageModule' },
  { path: 'create-noti', loadChildren: './create-noti/create-noti.module#CreateNotiPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  {
    path: 'manage-member',
    loadChildren: () => import('./manage-member/manage-member.module').then( m => m.ManageMemberPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)
  },
  {
    path: 'invite-list',
    loadChildren: () => import('./invite-list/invite-list.module').then( m => m.InviteListPageModule)
  },
  {
    path: 'detailproject',
    loadChildren: () => import('./detailproject/detailproject.module').then( m => m.DetailprojectPageModule)
  },
  {
    path: 'noti',
    loadChildren: () => import('./noti/noti.module').then( m => m.NotiPageModule)
  },
  {
    path: 'task',
    loadChildren: () => import('./task/task.module').then( m => m.TaskPageModule)
  },
  {
    path: 'whiteboard',
    loadChildren: () => import('./whiteboard/whiteboard.module').then( m => m.WhiteboardPageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'check-password',
    loadChildren: () => import('./check-password/check-password.module').then( m => m.CheckPasswordPageModule)
  },
  {
    path: 'modify-userinfo',
    loadChildren: () => import('./modify-userinfo/modify-userinfo.module').then( m => m.ModifyUserinfoPageModule)
  },
  {
    path: 'manage-project-role',
    loadChildren: () => import('./manage-project-role/manage-project-role.module').then( m => m.ManageProjectRolePageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
