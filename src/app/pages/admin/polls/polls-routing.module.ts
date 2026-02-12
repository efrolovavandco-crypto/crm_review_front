import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PollsComponent} from "./polls.component";
import {RouterModule, Routes} from "@angular/router";


const routes: Routes = [
  {
    path: '',
    component: PollsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PollsRoutingModule { }
