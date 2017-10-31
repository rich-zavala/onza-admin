import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { RequestService, IServerResponse } from '../request.service';
import { InmueblesService } from '../inmuebles.service';
import Inmueble from '../../modelos/inmueble';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.css']
})
export class InmueblesComponent {
  inmuebles: Inmueble[];
  cargando = true;
  eliminando = false;

  ubicaciones: [
    { label: 'Norte', value: 'Norte' },
    { label: 'Sur', value: 'Sur' },
    { label: 'Este', value: 'Este' },
    { label: 'Oeste', value: 'Oeste' }
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private requestService: RequestService,
    private inmueblesServicio: InmueblesService,
    private router: Router) {
    this.inmuebles = inmueblesServicio.inmuebles;
    this.cargando = typeof this.inmuebles === 'undefined';

    inmueblesServicio.inmuebles$.subscribe(r => {
      this.cargando = false;
      this.inmuebles = [...r];
    });
  }

  eliminar(inmueble: Inmueble) {
    if (!this.eliminando) {
      this.confirmationService.confirm({
        message: 'Confirma la eliminación del registro #' + inmueble.id,
        accept: () => {
          this.eliminando = true;
          let error = () => alert('Ha ocurrido un error');

          let success = (res) => {
            if (res.error === 0) {
              this.eliminando = false;
              this.inmueblesServicio.removerRegistro(inmueble);
            }
          };

          this.requestService.eliminarInmueble(inmueble, success, error);
        }
      });
    }
  }
}
