export default class Inmueble {
  id: string;
  servicio: string;
  tipo: string;
  ubicacion: string;
  direccion: string;
  precio: number;
  descripcion: string;
  encabezado: string;
  metros: number;
  banos: number;
  habitaciones: number;
  fecha_registro: Date;
  fecha_update: Date;
  resumen: string;
  coordenadas: string;
  fotos: string[];
  miniaturas: string[];

  constructor(o: any) {
    this.id = o.id || this.id;
    this.servicio = o.servicio || this.servicio || 'Venta';
    this.tipo = o.tipo || this.tipo || 'Casa';
    this.ubicacion = o.ubicacion || this.ubicacion || 'Norte';
    this.direccion = o.direccion || this.direccion || '';
    this.precio = parseFloat(o.precio) || this.precio || 0;
    this.descripcion = o.descripcion || this.descripcion || '';
    this.encabezado = o.encabezado || this.encabezado || '';
    this.metros = parseFloat(o.metros) || this.metros || 0;
    this.banos = parseFloat(o.banos) || this.banos || 0;
    this.habitaciones = parseInt(o.habitaciones, 10) || this.habitaciones || 0;
    this.fecha_registro = o.fecha_registro || this.fecha_registro;
    this.fecha_update = o.fecha_update || this.fecha_update;
    this.resumen = o.resumen || this.resumen || '';
    this.coordenadas = o.coordenadas || this.coordenadas;
    this.fotos = o.fotos || [];
    this.miniaturas = o.miniaturas || [];
  }

  get fotos_count() {
    return this.fotos.length;
  }

  get foto_principal() {
    return this.miniaturas[0];
  }
}
