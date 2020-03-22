import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// or loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'main', loadChildren: './main/main.module#MainPageModule' },
  { path: 'task-list', loadChildren: './task-list/task-list.module#TaskListPageModule' },
  { path: 'generate-project', loadChildren: './generate-project/generate-project.module#GenerateProjectPageModule' },
  { path: 'create-big', loadChildren: './create-big/create-big.module#CreateBigPageModule' },
  { path: 'create-mid', loadChildren: './create-mid/create-mid.module#CreateMidPageModule' },
  { path: 'create-small', loadChildren: './create-small/create-small.module#CreateSmallPageModule' },
  { path: 'add-member', loadChildren: './add-member/add-member.module#AddMemberPageModule' },  { path: 'board', loadChildren: './board/board.module#BoardPageModule' },
  { path: 'create-noti', loadChildren: './create-noti/create-noti.module#CreateNotiPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },


]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
