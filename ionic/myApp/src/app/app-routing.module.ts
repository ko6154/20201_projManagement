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
  { path: 'add-member', loadChildren: './add-member/add-member.module#AddMemberPageModule' },  { path: 'board', loadChildren: './board/board.module#BoardPageModule' },
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
