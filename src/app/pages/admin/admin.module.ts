import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AdminComponent} from "./admin.component";
import {TableComponent} from "./table/table.component";
import {CreateModalModule} from "../../_component/create-modal/create-modal.module";
import {UploadModalModule} from "../../_component/upload-modal/upload-modal.module";
import {ReactiveFormsModule} from "@angular/forms";
import {DeleteModal} from "../../_component/delete-modal/delete-modal";
import {DeleteModalModule} from "../../_component/delete-modal/delete-modal.module";
import {EditModalModule} from "../../_component/edit-modal/edit-modal.module";
import {AccessModalModule} from "../../_component/access-modal/access-modal.module";
import { PollsComponent } from './polls/polls.component';
import {PollsModule} from "./polls/polls.module";
import {TableModule} from "./table/table.module";


const routes:Routes=[
  {
    path:'',
    component:AdminComponent,
  }
]
@NgModule({
  declarations:[
    TableComponent,
    AdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CreateModalModule,
    UploadModalModule,
    ReactiveFormsModule,
    AccessModalModule,
    DeleteModalModule,
    EditModalModule,
    TableModule
  ],
  exports:[
    RouterModule
  ]
})
export class AdminModule { }
