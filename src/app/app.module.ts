import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  EditorModule,
  TooltipModule,
  InputTextModule,
  DialogModule,
  PanelModule,
  MessagesModule,
  ButtonModule,
  DataTableModule,
  SharedModule,
  TabViewModule,
  DropdownModule,
  CheckboxModule,
  InputTextareaModule,
  FileUploadModule,
  OrderListModule,
  GMapModule
} from 'primeng/primeng';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { InmueblesComponent } from './inmuebles/inmuebles.component';
import { PaginasComponent } from './paginas/paginas.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AccesoComponent } from './acceso/acceso.component';
import { InmueblesFormComponent } from './inmuebles-form/inmuebles-form.component';

import { SessionService } from './session.service';
import { RequestService } from './request.service';
import { InmueblesService } from './inmuebles.service';
import { MessageService } from 'primeng/components/common/messageservice';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InmueblesComponent,
    PaginasComponent,
    NotFoundComponent,
    AccesoComponent,
    InmueblesFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [{
        path: 'inmuebles',
        component: InmueblesComponent
      },
      {
        path: 'inmuebles_form',
        component: InmueblesFormComponent
      },
      {
        path: 'inmuebles_form/:id',
        component: InmueblesFormComponent
      },
      {
        path: 'paginas/:seccion',
        component: PaginasComponent
      },
      {
        path: 'acceso',
        component: AccesoComponent
      },
      {
        path: '',
        component: LoginComponent
      }]
      // { path: '**', component: NotFoundComponent }]
    ),

    EditorModule,
    TooltipModule,
    InputTextModule,
    DialogModule,
    PanelModule,
    MessagesModule,
    ButtonModule,
    DataTableModule,
    SharedModule,
    TabViewModule,
    DropdownModule,
    CheckboxModule,
    InputTextareaModule,
    FileUploadModule,
    OrderListModule,
    GMapModule
  ],
  providers: [
    MessageService,
    SessionService,
    RequestService,
    InmueblesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
