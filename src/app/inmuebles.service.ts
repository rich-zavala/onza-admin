import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import Inmueble from '../modelos/inmueble';
// import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InmueblesService {
  inmuebles: Inmueble[];
  inmuebles$: Subject<Inmueble[]> = new Subject();

  constructor(private requestService: RequestService) {
    this.cargarRegistros();
  }

  cargarRegistros() {
    let success = registros => {
      let inmuebles = registros.valores.map(registro => new Inmueble(registro));
      this.inmuebles = inmuebles;
      this.inmuebles$.next(this.inmuebles);
      console.warn('Los inmuebles están listos!!!');
    };
    let error = () => alert('Ha ocurrido un error. Intente de nuevo más tarde.');
    this.requestService.obtenerInmuebles(success, error);
  }

  getInmueble(id: string) {
    let response = {
      inmueble: null,
      ready: false,
      error: false
    };

    if (this.inmuebles) { // Ya hay registros cargados
      let registro = this.inmuebles.filter(inmueble => inmueble.id === id);
      if (registro.length > 0) {
        response.inmueble = registro[0];
        response.ready = true;
      } else {
        response.error = true;
      }
    }

    return response;
  }

  agregarRegistro(registro: Inmueble) {
    this.inmuebles.push(registro);
    this.inmuebles$.next(this.inmuebles);
  }
}
