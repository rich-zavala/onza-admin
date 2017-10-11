import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Inmueble from '../../modelos/inmueble';
import { RequestService } from '../request.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-inmuebles-form',
  templateUrl: './inmuebles-form.component.html',
  styleUrls: ['./inmuebles-form.component.css']
})
export class InmueblesFormComponent {
  form: FormGroup;
  save: any = {};
  value: string;
  originalValue: string;
  noDelta = true;
  inmueble: Inmueble = new Inmueble({
    id: 0,
    servicio: 'Venta',
    tipo: 'Condominio',
    ubicacion: 'Norte',
    direccion: 'Calle 5e #444 por 48 y 46 Residencial Pensiones',
    precio: '1000000',
    descripcion: 'Una <b>linda</b> casa',
    metros: '1000',
    banos: '2',
    habitaciones: '5',
    encabezado: 'Bonita casa en Pensiones',
    foto_principal: '5.jpg',
    resumen: 'Ven a conocer nuestra mejor casa en el mejor rumbo de la ciudad',
    coordenadas: '17.0615173, -96.7259793',
    fotos: [
      '1.jpg',
      'nombre extremadamente largo y molesto!!!!.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg'
    ]
  });

  ubicaciones = [
    { label: 'Norte', value: 'Norte' },
    { label: 'Sur', value: 'Sur' },
    { label: 'Este', value: 'Este' },
    { label: 'Oeste', value: 'Oeste' }
  ];

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

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private reqService: RequestService
  ) {
    this.form = fb.group({
      informacion: fb.group({
        encabezado: [this.inmueble.encabezado, [Validators.required, Validators.minLength(4)]],
        precio: [this.inmueble.precio, [Validators.required]], // Investigar cómo hacer un validador de números positivos
        servicio: [this.inmueble.servicio, [Validators.required]],
        tipo: [this.inmueble.tipo, [Validators.required]],
        resumen: [this.inmueble.resumen, [Validators.required]],
        metros: [this.inmueble.metros, [Validators.required]],
        banos: [this.inmueble.banos, [Validators.required]],
        habitaciones: [this.inmueble.habitaciones, [Validators.required]]
      }),
      descripcion: fb.group({
        descripcion: [this.inmueble.descripcion, [Validators.required, Validators.minLength(4)]]
      }),
      ubicacion: fb.group({
        ubicacion: [this.inmueble.ubicacion, [Validators.required]],
        direccion: [this.inmueble.direccion, [Validators.required, Validators.minLength(4)]]
      })
    });

    this.showSaveBtn();

    console.log(this.form);
  }

  showSaveBtn() {
    this.save.pending = true;
    this.save.success = false;
    this.save.working = false;
  }

  guardar($event) {
    $event.stopPropagation();
    this.save.pending = false;
    this.save.working = true;
    let info = this.form.value.claves;
    delete info.confirmPassword;

    let success = () => {
      this.save.success = true;
      setTimeout(() => {
        this.showSaveBtn();
      }, 2000);
    };
    let error = () => this.showSaveBtn();
    let complete = () => this.save.working = false;

    this.reqService.cambiarAccesos(info, success, error, complete);

  }
  updateButtons() {
    if (this.value !== this.originalValue) {
      this.noDelta = false;
    }
  }
}


