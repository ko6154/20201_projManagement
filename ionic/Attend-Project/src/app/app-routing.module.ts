import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from './resolver/data-resolver.service';
import { HttpClientModule } from '@angular/common/http';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {path: 'attend-project', loadChildren: './attend-project/attend-project.module#AttendProjectPageModule'},
  {
    path: 'attend-project/:code',
    resolve: {
      attend_code: DataResolverService
    },
    loadChildren: './attend-project/attend-project.module#AttendProjectPageModule'
  },
  {
    path: 'login-page',
    loadChildren: () => import('./login-page/login-page.module').then( m => m.LoginPagePageModule)
  },
  {
    path: 'login-page/:proj_id',
    resolve : {
      proj_id: DataResolverService
    },
    loadChildren: () => import('./login-page/login-page.module').then( m => m.LoginPagePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    HttpClientModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
