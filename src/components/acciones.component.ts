import { Component, EventEmitter, Output } from "@angular/core";
import { Accion, TipoAccion } from "../models/accion";
import { FormsModule, NgForm } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { IftaLabelModule } from "primeng/iftalabel";
import { TextareaModule } from "primeng/textarea";

@Component({
  selector: 'app-acciones',
  template: `
    <div ngForm #accionForm="ngForm" class="accion-form">
      <p-iftalabel class="campo-accion">
      <p-select
        inputId="accion-tipo"
        name="tipo"
        [(ngModel)]="tipo"
        [options]="tipos"
        [fluid]="true"
        appendTo="body"
        required
      />
      <label for="accion-tipo">Tipo de acción</label>
      </p-iftalabel>

      @switch (tipo) {
        @case ('email') {
          <p-iftalabel class="campo-accion">
            <input
            pInputText
            id="accion-destinatario"
            name="destinatario"
            [(ngModel)]="destinatario"
            type="email"
            email
            required
          />
            <label for="accion-destinatario">Destinatario</label>
          </p-iftalabel>

          <p-iftalabel class="campo-accion">
            <input
            pInputText
            id="accion-asunto"
            name="asunto"
            [(ngModel)]="asunto"
            required
            pattern=".*\\S.*"
          />
            <label for="accion-asunto">Asunto</label>
          </p-iftalabel>

          <p-iftalabel class="campo-accion">
            <textarea pTextarea
            id="accion-cuerpo"
            name="cuerpo"
            [(ngModel)]="cuerpo"
            required
            pattern="[\\s\\S]*\\S[\\s\\S]*"
            rows="5"
          ></textarea>
            <label for="accion-cuerpo">Cuerpo</label>
          </p-iftalabel>
        }

        @case ('sms') {
          <p-iftalabel class="campo-accion">
            <input
            pInputText
            id="accion-telefono"
            name="telefono"
            [(ngModel)]="telefono"
            type="tel"
            pattern="[+]?[0-9]{7,15}"
            required
          />
            <label for="accion-telefono">Número telefónico</label>
          </p-iftalabel>

          <p-iftalabel class="campo-accion">
            <textarea pTextarea
            id="accion-mensaje"
            name="mensaje"
            [(ngModel)]="mensaje"
            required
            maxlength="160"
            pattern="[\\s\\S]*\\S[\\s\\S]*"
            rows="3"
          ></textarea>
            <label for="accion-mensaje">Mensaje</label>
          </p-iftalabel>

          <small>{{ mensaje?.length ?? 0 }}/160 caracteres</small>
        }

        @case ('webhook') {
          <p-iftalabel class="campo-accion">
            <input
            pInputText
            id="accion-url"
            name="url"
            [(ngModel)]="url"
            type="url"
            pattern="https?://[^\\s]+"
            required
          />
            <label for="accion-url">URL</label>
          </p-iftalabel>

          <p-iftalabel class="campo-accion">
          <p-select
            inputId="accion-metodo"
            name="metodo"
            [(ngModel)]="metodo"
            [options]="metodos"
            [fluid]="true"
            appendTo="body"
            required
          />
          <label for="accion-metodo">Método</label>
          </p-iftalabel>
        }
      }

      <p-button
        type="button"
        label="Agregar acción"
        [disabled]="!accionForm.valid"
        (onClick)="insertarAccion(accionForm)"
      />
    </div>
  `,
  styles: `
    .accion-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 0;
    }

    .campo-accion {
      display: block;
      width: 20rem;
      max-width: 100%;
      min-width: 0;
    }

    .campo-accion input,
    .campo-accion textarea {
      width: 100%;
      box-sizing: border-box;
    }

    .campo-accion textarea {
      resize: vertical;
    }

    .accion-form > p-button {
      align-self: flex-start;
    }
  `,
  imports: [ IftaLabelModule, TextareaModule, InputTextModule, ButtonModule, FormsModule, SelectModule ]
})
export class AccionesComponent {
  @Output() agregarAccion = new EventEmitter<Accion>();

  tipos: TipoAccion[] = ['email', 'sms', 'webhook'];
  tipo: TipoAccion = 'email';

  destinatario = '';
  asunto = '';
  cuerpo = '';

  telefono = '';
  mensaje = '';

  url = '';
  metodo: 'POST' | 'PUT' = 'POST';
  metodos = ['POST', 'PUT'];

  insertarAccion(formulario: NgForm): void {
    if (!formulario.valid) return;

    let accion: Accion;

    switch (this.tipo) {
      case 'email':
        accion = {
          tipo: 'email',
          destinatario: this.destinatario.trim(),
          asunto: this.asunto,
          cuerpo: this.cuerpo
        };
        break;

      case 'sms':
        accion = {
          tipo: 'sms',
          telefono: this.telefono.trim(),
          mensaje: this.mensaje
        };
        break;

      case 'webhook':
        accion = {
          tipo: 'webhook',
          url: this.url.trim(),
          metodo: this.metodo
        };
        break;
    }

    this.agregarAccion.emit(accion);

    formulario.resetForm({
      tipo: this.tipo,
      metodo: 'POST'
    });
  }
}
