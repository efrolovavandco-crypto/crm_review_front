import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AdminComponent} from "./admin.component";
import {TableComponent} from "./table/table.component";
import {CreateModalModule} from "../../_component/CreateModal/create-modal.module";
import {UploadModalModule} from "../../_component/UploadModal/upload-modal.module";
import {ReactiveFormsModule} from "@angular/forms";
import {DeleteModal} from "../../_component/DeleteModal/delete-modal";
import {DeleteModalModule} from "../../_component/DeleteModal/delete-modal.module";
import {EditModalModule} from "../../_component/EditModal/edit-modal.module";
import {AccessModalModule} from "../../_component/AccessModal/access-modal.module";


const routes:Routes=[
  {
    path:'',
    component:AdminComponent
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

  ],
  exports:[
    RouterModule
  ]
})
export class AdminModule { }
