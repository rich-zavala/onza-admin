import { Component } from '@angular/core';
import { RequestService, IServerResponse } from '../request.service';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.css']
})
export class InmueblesComponent {
  inmuebles: any[];

  constructor(private saveService: RequestService) {
    this.obtenerInmuebles();
  }

  obtenerInmuebles() {
    let success = (res: IServerResponse) => {
      this.inmuebles = res.valores;
    };
    let error = () => alert('Ha ocurrido un error. Intente de nuevo más tarde.');
    this.saveService.obtenerInmuebles(success, error, () => null)
  }

}
