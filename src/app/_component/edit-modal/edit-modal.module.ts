import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditModal} from "./edit-modal";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [EditModal],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
  exports:[
    EditModal
  ]
})
export class EditModalModule { }
