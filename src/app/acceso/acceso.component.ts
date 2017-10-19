/**
 * Este componente sirve para cambiar los datos de acceso al portal administrativo.
 * Genera un objeto "FormBuilder" que permite controlar el status del formulario y así saber
 * si es válido o no.
 */

import { Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { RequestService } from '../request.service';

/**
 * Esta clase sirve para hacer la validación de la contraseña y su confirmación.
 * Saqué este código de:
 * https://scotch.io/@ibrahimalsurkhi/match-password-validation-with-angular-2
 */
export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password !== confirmPassword) {
      AC.get('confirmPassword').setErrors({ MatchPassword: true })
    } else {
      return null
    }
  }
}

@Component({
  selector: 'app-acceso',
  template: `
  <form [formGroup]="form" (ngSubmit)="guardar($event)">
    <div class="row marginBottom10">
      <div class="col-sm-9">
        <blockquote>Ingresa la información tal como deseas que se muestre en la portal</blockquote>
      </div>
      <div class="col-sm-3 text-right">
        <button class="btn btn-primary btn-block" pTooltip="Guardar cambios" tooltipPosition="top" *ngIf="save.pending" [disabled]="form.invalid">
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
    <div class="row">
      <div class="col-sm-12">
          <div formGroupName="claves">
            <div class="input-container">
              <span class="ui-float-label">
                <input id="usuario" type="text" formControlName="nombre" autofocus pInputText>
                <label for="usuario">Nombre del nuevo usuario</label>
              </span>
            </div>
            <div class="input-container">
              <span class="ui-float-label">
                <input id="password" type="password" formControlName="password" pInputText>
                <label for="password">Nueva contraseña</label>
              </span>
            </div>
            <div class="input-container">
              <span class="ui-float-label">
                <input id="confirmPassword" type="password" formControlName="confirmPassword" pInputText>
                <label for="confirmPassword">Confirma la contraseña</label>
              </span>
            </div>
          </div>
      </div>
    </div>
  </form>
  `,
  styleUrls: ['./acceso.component.css']
})
export class AccesoComponent {
  form: FormGroup; // Objeto de formulario
  save: any = {}; // Objeto para mostrar los botones

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private reqService: RequestService
  ) {
    this.form = fb.group({  // Creamos un FormGroup principal. Esto se hace así porque es posible meter varios grupos al mismo tiempo (pero ahora sólo meteremos uno)
      'claves': fb.group({ // Creamos un FormGroup secundario llamado "claves"
        nombre: ['', [Validators.required, Validators.minLength(4)]], // Campo de nombre con dos validaciones: requires y caracteres mínimos de 4
        password: ['', [Validators.required, Validators.minLength(4)]], // Campo de password con sus validaciones
        confirmPassword: ['', [Validators.required, Validators.minLength(4)]],  // Campo de confirmación de contraseña con sus validaciones
      }, { // FormGroup toma dos parámetros: los campos y validaciones secundarias.
          validator: PasswordValidation.MatchPassword  // Esta validación secundaria instancía la clase "PasswordValidation" para verificar que las contraseñas son idénticas
        })
    });

    this.showSaveBtn(); // Mostrar el botón de guardar
  }

  /**
   * Mostrar el botón "guardar" y ocultar el resto
   */
  showSaveBtn() {
    this.save.pending = true;
    this.save.success = false;
    this.save.working = false;
  }

  /**
   * Guardar el cambio de claves de acceso
   */
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

}
