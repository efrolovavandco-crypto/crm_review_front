import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PollsUserComponent} from "./polls-user.component";



@NgModule({
  declarations: [
    PollsUserComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    PollsUserComponent
  ]
})
export class PollsUserModule { }
