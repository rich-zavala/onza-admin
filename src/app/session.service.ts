import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { RequestService } from './request.service';

const storageId = 'onzaToken';

@Injectable()
export class SessionService {
  private servidor = 'http://192.168.0.20/onza/acceso/';
  sesionInicializada = false;
  sesionControlador$: Subject<boolean> = new Subject();

  constructor(private http: HttpClient, private request: RequestService) {
    this.verificarStorage();
  }

  verificarStorage() {
    this.verificarSesion();
  }

  verificarSesion() {

    let subject = this.http.get(this.servidor);
    let success = (res) => this.inicializarSesion();
    let error = (res) => this.finalizarSesion();
    return this.request.httpRequest(subject, success, error);
  }

  inicializarSesion() {
    this.sesionInicializada = true;
    this.sesionControlador$.next(true);
  }

  finalizarSesion() {
    let subject = this.http.get(this.servidor + 'logout');
    this.request.httpRequest(subject, null, null);
    this.sesionInicializada = false;
    this.sesionControlador$.next(false);
  }
}
