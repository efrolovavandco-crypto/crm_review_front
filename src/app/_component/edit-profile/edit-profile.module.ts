import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditProfileComponent} from "./edit-profile.component";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    EditProfileComponent
  ]
})
export class EditProfileModule { }
