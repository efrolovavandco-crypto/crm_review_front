import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DeleteModal} from "./delete-modal";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [DeleteModal],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
  exports:[
    DeleteModal
  ]
})
export class DeleteModalModule { }
