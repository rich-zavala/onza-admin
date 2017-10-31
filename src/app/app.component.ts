import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from './session.service';

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
    new Seccion('paginas/acerca_de', 'fa-building', 'Acerca de Nosotros'),
    new Seccion('paginas/mision', 'fa-handshake-o', 'Mision'),
    new Seccion('paginas/vision', 'fa-newspaper-o', 'Vision'),
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
    this.secciones.forEach(seccion => {
      if (idSeccion.includes(seccion.nombre)) {
        seccion.activar();
        this.seccionActual = seccion;
      } else {
        seccion.desactivar();
      }
    });
  }

  logout() {
    this.session.cerrar();
  }
}
