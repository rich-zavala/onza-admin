import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inmuebles-form',
  templateUrl: './inmuebles-form.component.html',
  styleUrls: ['./inmuebles-form.component.css']
})
export class InmueblesFormComponent implements OnInit {



  servicios = [
    { label: 'Renta', value: 'Renta' },
    { label: 'Venta', value: 'Venta' }
  ];
  selectedServicios: string[];


  tipos = [
    { label: 'Casa', value: 'Casa' },
    { label: 'Condominio', value: 'Condominio' },
    { label: 'Bodega', value: 'Bodega' },
    { label: 'Departamento', value: 'Departamento' },
    { label: 'Terreno', value: 'Terreno' },
    { label: 'Penthouse', value: 'Penthouse' },
    { label: 'Local', value: 'Local' },
    { label: 'Oficina', value: 'Oficina' },
    { label: 'Villa', value: 'Villa' },
    { label: 'Edificio', value: 'Edificio' }
  ];
  selectedTipos = [];


  constructor() { }

  ngOnInit() {
  }

}


