import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Inmueble from '../../modelos/inmueble';
import { RequestService } from '../request.service';
import { InmueblesService } from '../inmuebles.service';
import { cloneDeep } from 'lodash';
import { map } from 'lodash';
import { remove } from 'lodash';

declare var google: any;

const MAP_LAT = 20.966744;
const MAP_LNG = -89.623002;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-inmuebles-form',
  templateUrl: './inmuebles-form.component.html',
  styleUrls: ['./inmuebles-form.component.css']
})
export class InmueblesFormComponent {
  cargando = true;
  // creando = false; // Para evitar el error del FromControl en el campo "descripcion"

  form: FormGroup;
  save: any = {};
  value: string;
  originalValue: string;
  noDelta = true;
  id: string;
  inmueble: Inmueble;
  inmuebleCargado = false;

  // Catálogos
  catalogos = {
    ubicaciones: [
      { label: 'Centro', value: 'Centro' },
      { label: 'Norte', value: 'Norte' },
      { label: 'Sur', value: 'Sur' },
      { label: 'Este', value: 'Este' },
      { label: 'Oeste', value: 'Oeste' }
    ],
    tipos: [
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
    ]
  };

  // Opciones iniciales del mapa
  mapOptions = {
    center: { lat: MAP_LAT, lng: MAP_LNG },
    zoom: 13
  };

  // Información del marcador seleccionado en el mapa
  mapCoordenadas = {
    lat: MAP_LAT,
    lng: MAP_LNG
  };

  // Información del marcador del mapa
  mapMarcador = [];

  // Destino de las imagenes
  servidor = '';

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    private reqService: RequestService,
    private inmueblesServicio: InmueblesService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {

    route.params.subscribe(params => { // Obtener el ID del inmueble desde el URL
      this.id = params.id;
      if (this.id) { // Edición
        this.setServidor();
        this.obtenerInmueble();
      } else { // Creación
        this.inmueble = new Inmueble({});
        this.establecerMarcador(MAP_LAT, MAP_LNG);
        this.mapOptions.zoom = 13;
        this.setReady();
      }
    });
  }

  obtenerInmueble() {
    let inmuebleInfo = this.inmueblesServicio.getInmueble(this.id);
    if (inmuebleInfo.ready) {
      this.inmueble = cloneDeep(inmuebleInfo.inmueble);

      // Poner coordenadas en el marcador
      if (this.inmueble.coordenadas && this.inmueble.coordenadas !== '') {
        let coordenadas = this.inmueble.coordenadas.split(',');
        let lat = parseFloat(coordenadas[0]);
        let lng = parseFloat(coordenadas[1]);
        this.establecerMarcador(lat, lng);
      }
      this.setReady();
    } else if (inmuebleInfo.error) {
      alert('El registro que estás buscando no se encuentra disponible.');
      this.router.navigateByUrl('/inmuebles');
    } else {
      this.inmueblesServicio.inmuebles$.subscribe(r => {
        if (!this.inmuebleCargado) { // Para evitar errores con el editor
          this.obtenerInmueble();
        }
      });
    }
  }

  setReady() {
    this.setFormData();
    this.cargando = false;
    this.inmuebleCargado = true;
  }

  setFormData() {
    this.form = this.fb.group({
      informacion: this.fb.group({
        encabezado: [this.inmueble.encabezado, [Validators.required, Validators.minLength(4)]],
        precio: [this.inmueble.precio, [Validators.required]], // Investigar cómo hacer un validador de números positivos
        servicio: [this.inmueble.servicio, [Validators.required]],
        tipo: [this.inmueble.tipo, [Validators.required]],
        resumen: [this.inmueble.resumen, [Validators.required]],
        metros: [this.inmueble.metros, [Validators.required]],
        banos: [this.inmueble.banos, [Validators.required]],
        habitaciones: [this.inmueble.habitaciones, [Validators.required]]
      }),
      descripcion: this.fb.group({
        descripcion: [this.inmueble.descripcion, [Validators.required, Validators.minLength(4)]]
      }),
      ubicacion: this.fb.group({
        ubicacion: [this.inmueble.ubicacion, [Validators.required]],
        direccion: [this.inmueble.direccion]
      })
    });

    this.showSaveBtn();
    this.setFotosUrl();
  }

  showSaveBtn() {
    this.save.pending = true;
    this.save.success = false;
    this.save.working = false;
    this.save.disabled = false;
  }

  guardar($event) {
    $event.stopPropagation();
    this.setBotonesWait();

    /**
     * El orden se establece en inmueble.miniaturas, pero la BDD almacena inmuebles.fotos
     * Entonces hay que actualizar el orden de las fotos según el orden de las miniaturas
     */
    this.inmueble.fotos = this.inmueble.miniaturas.map(f => {
      let base = f.substring(f.lastIndexOf('/') + 1);
      if (base.lastIndexOf('.') !== -1) {
        base = base.substring(0, base.lastIndexOf('.'));
      }
      return base.replace('_thumb', '') + '.' + 'jpg';
    });


    let success = (response) => {
      let registroNuevo = new Inmueble(response.valores);

      // Actualizar el inmueble dentro del arreglo de registros en el servicio
      if (this.id) { // Actualizar
        let registroActual = this.inmueblesServicio.inmuebles.find(registro => registro.id === registroNuevo.id);
        let registroActualPosicion = this.inmueblesServicio.inmuebles.indexOf(registroActual);
        this.inmueblesServicio.inmuebles[registroActualPosicion] = registroNuevo;
      } else { // Crear
        this.inmueble = registroNuevo;
        this.id = this.inmueble.id;
        this.setServidor();
        this.inmueblesServicio.agregarRegistro(registroNuevo);
        this.location.replaceState('/inmuebles_form/' + registroNuevo.id);
      }

      this.inmueblesServicio.actualizarRegistro(this.inmueble);

      // Actualizar botones
      this.save.working = false;
      this.save.success = true;
      setTimeout(() => {
        this.showSaveBtn();
      }, 2000);
    };

    if (this.id) { // Actualizar
      this.reqService.guardarInmueble(this.inmueble, success, null);
    } else { // Crear
      this.reqService.registrarInmueble(this.inmueble, success, null);
    }
  }

  updateButtons() {
    if (this.value !== this.originalValue) {
      this.noDelta = false;
    }
  }

  ponerCoordenadas($event) {
    this.mapCoordenadas.lat = $event.latLng.lat();
    this.mapCoordenadas.lng = $event.latLng.lng();
    this.inmueble.coordenadas = this.mapCoordenadas.lat + ',' + this.mapCoordenadas.lng;
    this.establecerMarcador(this.mapCoordenadas.lat, this.mapCoordenadas.lng);
  }

  establecerMarcador(lat: number, lng: number) {
    this.mapMarcador = [new google.maps.Marker({ position: { lat: lat, lng: lng }, title: 'Esta es la ubicación del inmueble' })];
    this.mapOptions = {
      center: { lat, lng },
      zoom: 17
    }
  }

  imagenesSubir() {
    this.save.disabled = true;
  }

  imagenesSubidas($event) {
    let imagenes = JSON.parse($event.xhr.response);
    this.inmueble.fotos = map(imagenes.registros, (foto: any) => foto.archivo);
    this.inmueble.miniaturas = map(imagenes.miniaturas, (foto: any) => foto.archivo);
    this.setFotosUrl();
    this.save.disabled = false;
    this.inmueblesServicio.actualizarRegistro(this.inmueble);
  }

  imagenesError($event) {
    alert('Ha ocurrido un error. Intente de nuevo más tarde');
    this.save.disabled = false;
  }

  setFotosUrl() {
    let setUrl = foto => {
      if (foto) {
        let fotoName = foto.split(/(\\|\/)/g).pop();
        return this.reqService.getServidorPrincipal() + 'fotos/' + this.id + '/' + fotoName;
      }
    };

    this.inmueble.fotos = map(this.inmueble.fotos, setUrl);
    this.inmueble.miniaturas = map(this.inmueble.miniaturas, setUrl);
  }

  eliminarFoto(thumb) {
    let sufix = '_thumb';
    let foto = thumb.split(sufix).join('');
    if (!this.save.disabled) {
      this.save.disabled = true;
      let data = {
        id: this.id,
        archivo: foto
      };

      let error = () => {
        alert('Ha ocurrido un error');
        this.save.disabled = false;
      };

      let success = (res) => {
        if (res.error === 0) {
          remove(this.inmueble.fotos, infoto => infoto === foto);
          remove(this.inmueble.miniaturas, infoto => infoto === thumb);
          this.save.disabled = false;
        } else {
          error();
        }

        this.inmueblesServicio.actualizarRegistro(this.inmueble);
      };

      this.reqService.eliminarFoto(data, success, error);
    }
  }

  setBotonesWait() {
    this.save.pending = false;
    this.save.working = true;
  }

  setServidor() {
    this.servidor = this.reqService.getServidor() + 'upload/' + this.id + '.html';
  }

  removerMapa() {
    this.inmueble.coordenadas = '';
    this.mapMarcador = [];
  }
}
