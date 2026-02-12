import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccessModal} from "./access-modal";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [AccessModal],
  imports: [
    CommonModule,
    NgbInputDatepicker,
    ReactiveFormsModule
  ],
  exports:[
    AccessModal
  ]
})
export class AccessModalModule { }
