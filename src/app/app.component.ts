import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from './session.service';
import * as _ from 'lodash';

class Seccion {
  nombre: string;
  icono: string;
  active = false;
  titulo: string;

  constructor(nombre, icono, titulo) {
    this.nombre = nombre;
    this.icono = icono;
    this.titulo = titulo;
  }

  activar() {
    this.active = true;
  }

  desactivar() {
    this.active = false;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  verificandoSesion = true;
  sesionInicializada = false;

  secciones: Seccion[] = [
    new Seccion('inmuebles', 'fa-home', 'Inmuebles'),
    new Seccion('paginas/conocenos', 'fa-building', 'Conócenos'),
    new Seccion('paginas/servicios', 'fa-handshake-o', 'Servicios'),
    new Seccion('paginas/preguntas', 'fa-question', 'Preguntas'),
    new Seccion('paginas/contacto', 'fa-phone', 'Contacto'),
    new Seccion('acceso', 'fa-user', 'Acceso'),
  ];

  seccionActual: Seccion;

  constructor(
    private session: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sesionInicializada = session.sesionInicializada;
    session.sesionControlador$.subscribe(status => {
      this.verificandoSesion = false;
      this.sesionInicializada = status;
    });

    router.events.subscribe((url: any) => {
      this.activarSeccion(router.url);
    });
  }

  activarSeccion(idSeccion) {
    let activado = false;
    let pagina: string;
    let parts = idSeccion.split('/');
    if (parts[1] === 'paginas' && parts[2]) {
      pagina = 'paginas/' + parts[2];
    } else if (parts[1] === 'inmuebles_form') {
      pagina = 'inmuebles';
    } else {
      pagina = parts[1];
    }

    this.secciones.forEach(seccion => {
      if (pagina === seccion.nombre) {
        seccion.activar();
        this.seccionActual = seccion;
        activado = true;
      } else {
        seccion.desactivar();
      }
    });

    if (!activado) {
      this.seccionActual = undefined;
    }
  }

  logout() {
    this.session.cerrar();
  }
}
