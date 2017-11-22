import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { IServerResponse } from './request.service';

export const servidorPrincipal = 'http://www.onzainmobiliaria.com/';
const storageId = 'onzaToken';

@Injectable()
export class SessionService {
  private servidor = servidorPrincipal + 'acceso/';
  sesionInicializada = false;
  sesionControlador$: Subject<boolean> = new Subject();

  constructor(private http: HttpClient) {
    this.verificarSesion();
  }

  verificarSesion() {
    let subject = this.http.get(this.servidor);
    let success = res => this.inicializarSesion();
    return this.httpRequest(subject, success);
  }

  inicializarSesion() {
    this.sesionInicializada = true;
    this.sesionControlador$.next(true);
  }

  cerrar() {
    let subject = this.http.get(this.servidor + 'logout');
    this.httpRequest(subject, null);
    this.finalizarSesion();
  }

  finalizarSesion() {
    this.sesionInicializada = false;
    this.sesionControlador$.next(false);
  }

  httpRequest(subject: Observable<Object>, success: Function) {
    subject.subscribe(
      (res: IServerResponse) => {
        switch (res.error) {
          case 0: // Sesión iniciada
            if (typeof success === 'function') {
              success(res);
            }
            break;

          case 1: // Nunca sucede
            break;

          case 2: // No hay sesión
            this.sesionInicializada = false;
            this.sesionControlador$.next(false);
            break;

          default:
            alert('Ha ocurrido un error. Intente de nuevo más tarde.');
        }
      },
      (res: IServerResponse) => {
        alert('Ha ocurrido un error. Intente de nuevo más tarde.');
      });
  }
}
