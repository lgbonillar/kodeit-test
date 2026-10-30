import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { IftaLabelModule } from 'primeng/iftalabel'
import { InputTextModule } from 'primeng/inputtext'
import { RadioButtonModule } from 'primeng/radiobutton'
import { SelectModule } from 'primeng/select'
import { CampoDisponible, Condicion, DISPARADOR, TipoCampo } from '../../../../models/disparador'
import { TooltipModule } from 'primeng/tooltip'
import { ChipModule } from 'primeng/chip'

@Component({
  selector: 'app-condition',
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex gap-4 items-center border-b border-b-stone-200 pb-4">
        <span class="text-sm min-w-25">Declaración</span>
        <aside class="flex flex-col gap-4">
          <div class="flex gap-2 items-center">
            <p-radiobutton name="statement" value="all" [(ngModel)]="statement" inputId="statement-all" />
            <label for="statement-all" class="text-sm">TODOS (Filtrar si se cumplen TODAS las siguientes condiciones)</label>
          </div>
          <div class="flex gap-2 items-center">
            <p-radiobutton name="statement" value="any" [(ngModel)]="statement" inputId="statement-any" />
            <label for="statement-any" class="text-sm">CUALQUIERA (Filtrar si se cumple ALGUNA de las siguientes condiciones)</label>
          </div>
        </aside>
      </div>

      <div ngForm #condicionForm="ngForm" class="flex gap-4 items-center w-full">
        <span class="text-sm min-w-25">Condición</span>

        <div class="flex flex-col gap-4 flex-1">
          <div class="flex gap-4">
            <p-iftalabel class="w-full">
              <p-select [ngModel]="campoSeleccionado" (ngModelChange)="resetForm($event)" required name="campo" inputId="condicion-campo" [options]="camposDisponibles" optionLabel="nombre" [fluid]="true" appendTo="body" />
              <label for="condicion-campo">Campo</label>
            </p-iftalabel>
            
            <p-iftalabel class="w-full">
              <p-select [(ngModel)]="operadorSeleccionado" required name="operador" inputId="condicion-operador" [options]="operadoresDisponibles" [fluid]="true" appendTo="body" [disabled]="!campoSeleccionado" />
              <label for="condicion-operador">Operador</label>
            </p-iftalabel>
          </div>
          
          <div class="flex gap-4 items-center">
            <p-iftalabel class="flex-1">
              <input pInputText id="rule-keyword" required name="keyword" [(ngModel)]="keyword" autocomplete="off" class="w-full" />
              <label for="rule-keyword">Keyword</label>
            </p-iftalabel>
            
            <button pButton severity="secondary" [disabled]="!condicionForm.valid" (click)="insertCondition()" class="shrink-0" >
              <span>Insertar</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-1 items-start">
        @for (condicion of condiciones; track condicion.keyword; let i = $index) {
        <p-chip [removable]="true" (onRemove)="eliminarCondicion(i)">
          <span class="text-sm">
            EL campo {{ condicion.campo }} {{ condicion.operador }} <strong> {{ condicion.keyword }} </strong>
          </span>
        </p-chip>
        }
      </div>
  </div>
  `,
  imports: [ ButtonModule, ChipModule, RadioButtonModule, IftaLabelModule, SelectModule, InputTextModule, FormsModule, TooltipModule ]
})
export class ConditionComponent implements OnChanges {

  @Input() trigger: DISPARADOR | null = null
  @Output() conditionsChanged = new EventEmitter<Condicion[]>()

  statement: 'all' | 'any' = 'all'
  keyword = ''
  campoSeleccionado: CampoDisponible  | null = null
  operadorSeleccionado: string | null = null

  condiciones: Condicion[] = []

  camposPorDisparador: Record<DISPARADOR, CampoDisponible[]> = {
    CLIENTE_CREADO: [
      { nombre: 'País', type: 'texto' },
      { nombre: 'Plan', type: 'texto' }
    ],
    PAGO_RECIBIDO: [
      { nombre: 'Monto', type: 'numero' },
      { nombre: 'Moneda', type: 'texto' }
    ],
    TICKET_SIN_RESPUESTA: [
      { nombre: 'horas_sin_respuesta', type: 'numero' },
      { nombre: 'prioridad', type: 'texto' }
    ]
  }

  private operadoresPorTipo: Record<TipoCampo, string[]> = {
      texto: ['es igual a', 'contiene'],
      numero: ['es igual a', 'mayor que', 'menor que']
  }

  get operadoresDisponibles(): string[] {
    return this.campoSeleccionado
        ? this.operadoresPorTipo[this.campoSeleccionado.type]
        : []
  }

  get camposDisponibles(): CampoDisponible[] {
    return this.trigger
        ? this.camposPorDisparador[this.trigger]
        : []
  }

  resetForm(campo: CampoDisponible | null = null): void {
    this.campoSeleccionado = campo
    this.operadorSeleccionado = null
    this.keyword = ''
  }

  insertCondition () {
    if (
        !this.campoSeleccionado ||
        !this.operadorSeleccionado ||
        !this.keyword.trim()
    ) {
        return
    }

    const newCondition = {
      campo: this.campoSeleccionado.nombre,
      operador: this.operadorSeleccionado,
      keyword: this.keyword
    }
    
    this.condiciones = [...this.condiciones, newCondition]

    this.conditionsChanged.emit(this.condiciones);
    this.resetForm()
  }

  eliminarCondicion(indice: number): void {
    this.condiciones = this.condiciones.filter(
        (_, posicion) => posicion !== indice
    )
    this.conditionsChanged.emit(this.condiciones)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trigger']) {
      this.resetForm()
      this.condiciones = []
      this.conditionsChanged.emit(this.condiciones)
    }
  }
  
}
