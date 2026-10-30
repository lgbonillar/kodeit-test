import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, signal } from "@angular/core";

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DisparadorService } from "../services/disparador.service";
import { Rule } from "../models/rule";
import { DataViewModule } from 'primeng/dataview';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from "@angular/forms";
import { TagModule } from 'primeng/tag';
import { DisparadorComponent } from "./disparador.component";


@Component({
    selector: "app-rules",
    styles: `
      .rules-cabecera {
        display: flex;
        align-items: center;
        justify-content: space-between;

        border-bottom: 1px solid #ececec;
      }

      .list-container {
        max-width: 1200px;
        display: flex;
        justify-content: center;
        padding: 2rem 0;
      }

      .list-rule-information {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .list-rule-information--text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .list-rule-information--text > h3 {
        margin: 0;
      }

      .list-element {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 800px;
        border: 1px solid #ececec;
        padding: 1rem;
      }

      .list-element:hover {
        border-color: #e1e1e1;
      }

      .full-w {
        width: 100%;
      }
    `,
    template: `

      <header class="rules-cabecera">
        <h1>
          Listado de Reglas
        </h1>

        <p-button icon="pi pi-file-plus" [raised]="true" pTooltip="Nueva regla" (click)="showDialog()" />
      </header>

      <div class="list-container">
        <p-dataview #dv [value]="rules()" styleClass="full-w">
          <ng-template #list let-items>
            @for (item of items; track item.id) {
            <div class="list-element">
              <div class="list-rule-information">  
                <p-checkbox [inputId]="'enabled' + item.id" [binary]="true" [ngModel]="item.enabled" (ngModelChange)="cambiarEstado(item.id, $event)" [pTooltip]="item.enabled ? 'Clic para deshabilitar regla' : 'Clic para habilitar regla'" />
                
                <div class="list-rule-information--text">
                  <h3>{{ item.nombre }}</h3>
                  <span>{{ item.descripcion }}</span>
                  @if (item.disparador) {
                    <span><small>Disparador: </small><p-tag [value]="item.disparador.nombre" /></span>
                  }

                </div>
              </div>

              <div style="display: flex; gap: 1rem;">
                <p-button icon="pi pi-file-edit" [rounded]="true" severity="secondary" [outlined]="true" pTooltip="Editar regla" (click)="editarRegla(item)" />
                <p-button icon="pi pi-times" [rounded]="true" severity="danger" [outlined]="true" pTooltip="Eliminar regla" />
              </div>
            </div>
            }
          </ng-template>
        </p-dataview>
      </div>

      <p-dialog
          [header]="modoEdicion ? 'Edición de Regla' : 'Creando nueva regla'"
          [modal]="true"
          [(visible)]="visible"
          [style]="{ width: '50rem' }"
      >
        @if (visible) {
          <app-disparador [regla]="disparadorService.reglaSeleccionada" />
        }
      </p-dialog>
    `,
    imports: [ButtonModule, DataViewModule, CheckboxModule, CommonModule, CardModule, DialogModule, FormsModule, TagModule, TooltipModule, DisparadorComponent]
})
export class RulesComponent implements OnInit {

  rules = signal<Rule[]>([])

  reglas: Rule[] = []
  visible = false;
  modoEdicion = false;

  disparadorService = inject(DisparadorService)

  showDialog() {
    this.disparadorService.reglaSeleccionada = null;
    this.visible = true;
    this.modoEdicion = false;
  }

  private readonly http = inject(HttpClient)

  ngOnInit (): void {
    this.http.get<Rule[]>('/mock.json').subscribe((response: Rule[]) => {
      this.rules.set(response)

      this.reglas = response
    })
  }

  cambiarEstado (id: string, enabled: boolean): void {
    const listaActualizada = this.rules().map(regla => regla.id === id ? { ...regla, enabled } : regla)
    this.rules.set(listaActualizada)
  }

  editarRegla(regla: Rule) {
    this.disparadorService.reglaSeleccionada = structuredClone(regla)
    this.modoEdicion = true;
    this.visible = true;
  }

}
