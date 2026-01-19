import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CreateModal} from "./create-modal";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [CreateModal],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    CreateModal
  ]
})
export class CreateModalModule { }
