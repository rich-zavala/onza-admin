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
  foto_principal: string;
  fecha_registro: Date;
  fecha_update: Date;
  resumen: string;
  coordenadas: string;
  fotos: string[];

  constructor(o: any) {
    this.id = o.id || this.id;
    this.servicio = o.servicio || this.servicio || 'Venta';
    this.tipo = o.tipo || this.tipo || 'Casa';
    this.ubicacion = o.ubicacion || this.ubicacion || 'Norte';
    this.direccion = o.direccion || this.direccion || '123456';
    this.precio = o.precio || this.precio || '123456';
    this.descripcion = o.descripcion || this.descripcion || '123456';
    this.encabezado = o.encabezado || this.encabezado || '123456';
    this.metros = o.metros || this.metros || '123456';
    this.banos = o.banos || this.banos || '123456';
    this.habitaciones = o.habitaciones || this.habitaciones || '123456';
    this.foto_principal = o.foto_principal || this.foto_principal;
    this.fecha_registro = o.fecha_registro || this.fecha_registro;
    this.fecha_update = o.fecha_update || this.fecha_update;
    this.resumen = o.resumen || this.resumen || '123456';
    this.coordenadas = o.coordenadas || this.coordenadas;
    this.fotos = o.fotos || [];
    // this.fotos = [];
    // for (let i = 1; i < 8; i++) {
    //     this.fotos.push(`assets/images/${i}.jpg`);
    //     this.fotos.push(`assets/images/${i}.jpg`);
    //     this.fotos.push(`assets/images/${i}.jpg`);
    // }
  }

  get fotos_count() {
    return this.fotos.length;
  }
}