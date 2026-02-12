import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JwtInterceptor} from "./_helpers/jwt.interceptor";
import {ErrorInterceptor} from "./_helpers/error.interceptor";
import {ReactiveFormsModule} from "@angular/forms";
// import {FakeBackendInterceptor} from "./_helpers/fake-backend";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditPollsComponent } from './_component/edit-polls/edit-polls.component';
import { PollsStatisticsComponent } from './_component/polls-statistics/polls-statistics.component';
import { DeletePollsComponent } from './_component/delete-polls/delete-polls.component';
import { StartPollsUserComponent } from './_component/start-polls-user/start-polls-user.component';
import { RestartPollsUserComponent } from './_component/restart-polls-user/restart-polls-user.component';
import { CreatePollsComponent } from './_component/create-polls/create-polls.component';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    EditPollsComponent,
    PollsStatisticsComponent,
    DeletePollsComponent,
    StartPollsUserComponent,
    RestartPollsUserComponent,
    CreatePollsComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot() //для одиночной регистрации глобальных сервисов
  ],
  providers: [
    {provide : HTTP_INTERCEPTORS, useClass : JwtInterceptor, multi:true},
    {provide : HTTP_INTERCEPTORS, useClass : ErrorInterceptor, multi:true},
    // {provide : HTTP_INTERCEPTORS, useClass:FakeBackendInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
