import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccessModal} from "./access-modal";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [AccessModal],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    AccessModal
  ]
})
export class AccessModalModule { }
