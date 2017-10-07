import { Component } from '@angular/core';
import { RequestService, IServerResponse } from '../request.service';
import Inmueble from '../../modelos/inmueble';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.css']
})
export class InmueblesComponent {
  inmuebles: Inmueble[] = [];
  cargando = true;

  constructor(private requestService: RequestService) {
    this.obtenerInmuebles();
  }

  obtenerInmuebles() {
    let success = (res: IServerResponse) => {
      this.inmuebles = res.valores.map(registro => new Inmueble(registro));
      this.cargando = false;
    };
    let error = () => alert('Ha ocurrido un error. Intente de nuevo más tarde.');
    this.requestService.obtenerInmuebles(success, error);
  }

  editar(inmueble: Inmueble) {
    alert("Editando inmueble: " + inmueble.id);
  }

  eliminar(inmueble: Inmueble) {
    alert("Eliminando inmueble: " + inmueble.id);
  }

  agregar() {
    alert("Agregando nuevo registro");
  }
}
