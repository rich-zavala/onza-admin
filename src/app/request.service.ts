/**
 * Este servicio provee métodos para obtener información de la base de datos.
 * También lanza un modal de logueo si, al enviar o solicitar datos, el servidor indica que se ha terminado la sesión.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

/**
 * Interfaz que indica el tipo de dato esperado de una página que será guardada
 */
export interface IPaginaData {
  seccion: string;
  valor?: string;
}

/**
 * Interfaz que indica el tipo de dato que resolverá el servidor cuando se le solicite información
 * "error" puede tener los siguientes valores:
 * 0 > Todo bien
 * 1 > Error
 * 2 > La sesión ha finalizado
 * "valores" es el objeto que contiene la información de lo que se haya solicitado
 */
export interface IServerResponse {
  error: number;
  valores: any;
}

@Injectable()
export class RequestService {
  private servidor = 'http://192.168.0.6/onza/admin/'; // URL del servidor
  private loginUrl = 'http://192.168.0.6/onza/acceso/login.html'; // URL del controlador de sesiones en el servidor
  private paginasUrl = this.servidor + 'paginas.html'; // URL del controlador de páginas en el servidor
  private accesosUrl = this.servidor + 'accesos.html'; // URL del controlador de claves de acceso en el servidor
  private inmueblesUrl = this.servidor + 'inmuebles.html'; // URL del controlador de claves de acceso en el servidor

  constructor(private http: HttpClient) { }

  /**
   * Esta función es un auxiliar que ejecuta los callbacks.
   * La puse aparte porque prácticamente todas las solicitudes al servidor son iguales...
   */
  httpRequest(subject: Observable<Object>, success: Function, error: Function, complete?: Function) {
    subject.subscribe(
      (res: IServerResponse) => {
        switch (res.error) {
          case 0: // Se guardó correctamente
            success(res);
            break;

          case 1: // Error del servidor
            if (typeof error === 'function') {
              error();
            }
            break;

          case 2: // La sesión ha terminado
            alert('Tu sesión de usuario ha terminado.');
            if (typeof error === 'function') {
              error();
            }
            break;

          default:
            alert('Ha ocurrido un error. Intente de nuevo más tarde. 1');
            if (typeof error === 'function') {
              error();
            }
        }
      },
      () => {
        if (typeof error === 'function') {
          error();
        }
      },
      () => {
        if (typeof complete === 'function') {
          complete();
        }
      });
  }

  login(data: IPaginaData, success: Function, error: Function, complete?: Function) {
    let subject = this.http.post(this.loginUrl, data);
    return this.httpRequest(subject, success, error, complete);
  }

  /**
   * Traer información de la tabla "paginas"
   * Los parámetros son funciones a ejecutarse en cada caso (callbacks)
   */
  obtenerPaginas(success: Function, error: Function, complete?: Function) {
    let subject = this.http.get(this.paginasUrl);
    return this.httpRequest(subject, success, error, complete);
  }

  /**
   * Registrar cambios de una sección dentro de la tabla "páginas"
   * "data" contiene la información que será mandada al servidor
   * El resto de los parámetros son funciones a ejecutarse en cada caso
   */
  guardarPagina(data: IPaginaData, success: Function, error: Function, complete?: Function) {
    let subject = this.http.put(this.paginasUrl, data);
    return this.httpRequest(subject, success, error, complete);
  }

  /**
   * Enviar cambios de claves de acceso
   */
  cambiarAccesos(data: any, success: Function, error: Function, complete?: Function) {
    let subject = this.http.put(this.accesosUrl, data);
    return this.httpRequest(subject, success, error, complete);
  }

  /**
   * Trae información de todos los inmuebles
   * Los parámetros son funciones a ejecutarse en cada caso (callbacks)
   */
  obtenerInmuebles(success: Function, error: Function) {
    let subject = this.http.get(this.inmueblesUrl);
    return this.httpRequest(subject, success, error);
  }
}
