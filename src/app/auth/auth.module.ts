import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from "./auth.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import {HttpClient, HttpClientModule} from "@angular/common/http";

const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent
  }
];

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(authRoutes)
  ]
})
export class AuthModule { }
