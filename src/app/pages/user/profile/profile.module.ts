import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileComponent} from "./profile.component";
import {EditProfileModule} from "../../../_component/edit-profile/edit-profile.module";




@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    EditProfileModule

  ],
  exports:[
    ProfileComponent
  ]
})
export class ProfileModule { }
