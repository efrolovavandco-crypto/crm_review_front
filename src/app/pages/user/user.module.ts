import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminComponent} from "../admin/admin.component";
import {RouterModule, Routes} from "@angular/router";
import {UserComponent} from "./user.component";

import {ProfileModule} from "./profile/profile.module";
import {EditProfileModule} from "../../_component/edit-profile/edit-profile.module";
import { PollsUserComponent } from './polls-user/polls-user.component';
import {PollsUserModule} from "./polls-user/polls-user.module";


const routes:Routes=[
  {
    path:'',
    component:UserComponent
  }
]
@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    ProfileModule,
    EditProfileModule,
    PollsUserModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule,
  ]
})
export class UserModule { }
