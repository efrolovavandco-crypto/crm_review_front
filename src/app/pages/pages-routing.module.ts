import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PagesComponent} from "./pages.component";
import {Router, RouterModule, Routes} from "@angular/router";


const routes:Routes=[
  {path:'',
  component:PagesComponent,
  children:[{
    path:'',
    redirectTo:'page',
    pathMatch:"full"
  },
  {
    path:'page',
    loadChildren:()=>import('../pages/pages.module').then(m=>m.PagesModule)
  },

  ]
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class PagesRoutingModule { }
