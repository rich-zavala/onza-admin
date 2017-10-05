import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { EditorModule, TooltipModule, InputTextModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { InmueblesComponent } from './inmuebles/inmuebles.component';
import { PaginasComponent } from './paginas/paginas.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RequestService } from './request.service';
import { AccesoComponent } from './acceso/acceso.component';
import { InmueblesFormComponent } from './inmuebles-form/inmuebles-form.component';

@NgModule({
  declarations: [
    AppComponent,
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
    RouterModule.forRoot(
      [{
        path: 'inmuebles',
        component: InmueblesComponent
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
        redirectTo: 'inmuebles',
        pathMatch: 'full'
      },
      { path: '**', component: NotFoundComponent }]
    ),

    EditorModule,
    TooltipModule,
    InputTextModule
  ],
  providers: [RequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
