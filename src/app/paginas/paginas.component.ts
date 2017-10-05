import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService, IServerResponse } from '../request.service';

@Component({
  selector: 'app-paginas',
  template: `
  <div class="row marginBottom10">
    <div class="col-sm-9">
      <blockquote>Ingresa la información tal como deseas que se muestre en la portal</blockquote>
    </div>
    <div class="col-sm-3 text-right">
      <button class="btn btn-primary btn-block" pTooltip="Guardar cambios" tooltipPosition="top" (click)="guardar()" *ngIf="save.pending" [disabled]="noDelta">
        <i class="fa fa-fw fa-2x fa-save"></i>
      </button>
      <button class="btn btn-success btn-block" title="Cambios guardados exitosamente" *ngIf="save.success">
        <i class="fa fa-fw fa-2x fa-check"></i>
      </button>
      <button class="btn btn-warning btn-block active" title="Guardando..." *ngIf="save.working">
        <i class="fa fa-fw fa-spinner fa-2x fa-pulse"></i>
      </button>
    </div>
  </div>
  <div class="row" *ngIf="value">
    <div class="col-sm-12">
      <p-editor [(ngModel)]="value" [style]="{'height':'320px'}" (onTextChange)="updateButtons()"></p-editor>
    </div>
  </div>
  `
})
export class PaginasComponent {
  seccion: string;
  save: any = {};
  value: string;
  originalValue: string;
  noDelta = true;

  constructor(private saveService: RequestService, private route: ActivatedRoute) {
    route.params.subscribe(params => {
      this.value = null;
      this.seccion = params.seccion;
      this.showSaveBtn();
      this.obtenerPaginas();
    });
  }

  obtenerPaginas() {
    let success = (res: IServerResponse) => {
      this.value = res.valores[0][this.seccion];
      this.originalValue = this.value;
      this.showSaveBtn();
    };
    let error = () => alert('Ha ocurrido un error. Intente de nuevo más tarde.');
    this.saveService.obtenerPaginas(success, error, () => null)
  }

  guardar() {
    this.save.pending = false;
    this.save.working = true;
    let info = { seccion: this.seccion, valor: this.value };

    let success = () => {
      this.save.success = true;
      setTimeout(() => {
        this.showSaveBtn();
      }, 2000);
    };
    let error = () => this.showSaveBtn();
    let complete = () => this.save.working = false;

    this.saveService.guardarPagina(info, success, error, complete);
  }

  showSaveBtn() {
    this.save.pending = true;
    this.save.success = false;
    this.save.working = false;
  }

  updateButtons() {
    if (this.value !== this.originalValue) {
      this.noDelta = false;
    }
  }
}
