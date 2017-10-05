import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { InmueblesComponent } from './inmuebles/inmuebles.component';
import { AcercadeComponent } from './acercade/acercade.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    InmueblesComponent,
    AcercadeComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [{
        path: 'inmuebles',
        component: InmueblesComponent
      },
      {
        path: 'acercade',
        component: AcercadeComponent
      },
      {
        path: '',
        redirectTo: 'inmuebles',
        pathMatch: 'full'
      },
      { path: '**', component: NotFoundComponent }]
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
