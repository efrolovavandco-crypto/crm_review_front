import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PollsComponent} from "./polls.component";
import {PollsRoutingModule} from "./polls-routing.module";
import {Router} from "@angular/router";
import {EditPollsModule} from "../../../_component/edit-polls/edit-polls.module";


@NgModule({

  declarations: [
    PollsComponent
  ],
  imports: [
    CommonModule,
    PollsRoutingModule,
    EditPollsModule
  ],
  exports:[
    PollsComponent,

  ]
})
export class PollsModule {
}
