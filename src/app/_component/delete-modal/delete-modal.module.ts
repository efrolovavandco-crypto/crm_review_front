import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DeleteModal} from "./delete-modal";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [DeleteModal],
    imports: [
        CommonModule,
        NgbInputDatepicker,
        ReactiveFormsModule
    ],
  exports:[
    DeleteModal
  ]
})
export class DeleteModalModule { }
