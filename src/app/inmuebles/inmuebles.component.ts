import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService, IServerResponse } from '../request.service';
import { InmueblesService } from '../inmuebles.service';
import Inmueble from '../../modelos/inmueble';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.css']
})
export class InmueblesComponent {
  inmuebles: Inmueble[];
  cargando = true;

  constructor(
    private requestService: RequestService,
    private inmueblesServicio: InmueblesService,
    private router: Router) {
    this.inmuebles = inmueblesServicio.inmuebles;
    this.cargando = typeof this.inmuebles === 'undefined';

    inmueblesServicio.inmuebles$.subscribe(r => {
      this.cargando = false;
      this.inmuebles = r;
    });
  }

  eliminar(inmueble: Inmueble) {
    alert('Eliminando inmueble: ' + inmueble.id);
  }
}
