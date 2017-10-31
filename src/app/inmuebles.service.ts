import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { SessionService } from './session.service';
import Inmueble from '../modelos/inmueble';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

@Injectable()
export class InmueblesService {
  inmuebles: Inmueble[];
  inmuebles$: Subject<Inmueble[]> = new Subject();
  sesionInicializada = false;

  constructor(private requestService: RequestService, private session: SessionService) {
    this.sesionInicializada = session.sesionInicializada;
    this.cargarRegistros();

    session.sesionControlador$.subscribe(status => {
      if (status) {
        this.cargarRegistros();
      }
    });
  }

  cargarRegistros() {
    if (this.sesionInicializada) {
      let success = res => {
        if (res.error === 0) {
          let inmuebles = res.valores.map(registro => new Inmueble(registro));
          this.inmuebles = inmuebles;
          this.inmuebles$.next(this.inmuebles);
        }
      };
      let error = () => alert('Ha ocurrido un error. Intente de nuevo más tarde.');
      this.requestService.obtenerInmuebles(success, error);
    }
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

  actualizarRegistro(registro: Inmueble) {
    let index = this.getRegistroIndex(registro);
    if (index >= 0) {
      this.inmuebles[index] = registro;
    } else {
      this.inmuebles.push(registro);
    }
    this.inmuebles$.next(this.inmuebles);
  }

  removerRegistro(registro: Inmueble) {
    let index = this.getRegistroIndex(registro);
    this.inmuebles.splice(index, 1);
    this.inmuebles$.next(this.inmuebles);
  }

  getRegistroIndex(registro: Inmueble) {
    return _.findIndex(this.inmuebles, r => r.id === registro.id);
  }
}
