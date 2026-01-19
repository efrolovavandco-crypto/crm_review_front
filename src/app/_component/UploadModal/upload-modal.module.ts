import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UploadModalComponent} from "./upload-modal.component";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    UploadModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    UploadModalComponent
  ]
})
export class UploadModalModule { }
