import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { SessionService } from '../session.service';
import { RequestService, IServerResponse } from '../request.service';

import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  display = true;
  // servidor = 'http://192.168.0.20/onza/acceso/';
  title = 'app';
  form: FormGroup;
  verificando = false;
  accesoConcedido = false;
  msgs: Message[] = [];

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private session: SessionService,
    private reqService: RequestService,
    private messageService: MessageService
  ) {
    session.finalizarSesion();

    this.form = fb.group({
      'login': fb.group({
        nombre: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(4)]],
      })
    });
  }

  login($event) {
    if (!this.verificando) {
      $event.stopPropagation();
      this.form.disable();
      this.resetMessages();
      this.verificando = true;
      this.msgs.push({ severity: 'info', summary: 'Verificando claves de accesso...' });

      let success = (res: IServerResponse) => {
        this.resetMessages();
        if (res.valores === 0) {
          this.acceder();
        } else {
          this.msgs.push({ severity: 'warn', summary: 'Las claves de acceso no son válidas' });
          this.form.enable();
        }
      };

      let error = () => {
        this.resetMessages();
        this.msgs.push({ severity: 'error', summary: 'Ha ocurrido un error', detail: 'Intente de nuevo más tarde' });
        this.form.enable();
      };

      this.reqService.login(this.form.value.login, success, error);
    }
  }

  resetMessages() {
    this.msgs = [];
    this.verificando = false;
  }

  acceder() {
    this.msgs.push({ severity: 'success', summary: 'Accesso correcto' });
    setTimeout(() => {
      this.accesoConcedido = true;
      this.session.inicializarSesion();
    }, 1500);
  }
}
