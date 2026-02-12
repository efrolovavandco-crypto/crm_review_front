import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {PagesComponent} from "./pages/pages.component";
import {AuthComponent} from "./auth/auth.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)
  },
  {
    path:'polls',
    loadChildren: () => import('./pages/admin/polls/polls.module').then(m => m.PollsModule)}


  // {path:'', redirectTo:'auth', pathMatch:"full"},
  // {
  //   path:'',
  //   component:AppComponent,
  //   children:[
  //     // {
  //     //   path:'page',
  //     //   loadChildren:()=>import('./pages/pages.module').then(m=>m.PagesModule),
  //     //   canActivate:[]
  //     // },
  //     {
  //       path:'auth',
  //       loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)
  //     },
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
