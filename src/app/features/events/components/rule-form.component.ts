import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core'
import { GuardarReglaRequest, Rule } from '../models/rule'
import { IftaLabelModule } from 'primeng/iftalabel'
import { SelectModule } from 'primeng/select'
import { FormsModule } from '@angular/forms'
import { Condiciones, DISPARADOR } from '../models/disparador'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip'
import { TabsModule } from 'primeng/tabs'
import { ConditionComponent } from './condition.component'
import { ActionsComponent } from './actions.component'
import { Accion } from '../models/accion'
import { MessageService } from 'primeng/api'
import { RulesService } from '../service/rules.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, EMPTY, finalize } from 'rxjs'

@Component({
  selector: 'app-rule-form',
  template: `
    <div class="flex flex-col gap-4">
      <section class="flex flex-col gap-4">
        <div>
          <p-iftalabel>
            <input pInputText id="rule-name" required name="nombre" [(ngModel)]="nombreRegla" autocomplete="off" class="w-full" />
            <label for="rule-name">Nombre</label>
          </p-iftalabel>
        </div>
        
        <div>
          <p-iftalabel>
            <input pInputText id="rule-description" name="descripcion" [(ngModel)]="descripcionRegla" autocomplete="off" class="w-full" />
            <label for="rule-description">Descripción</label>
          </p-iftalabel>
        </div>
        
        <div>
          <p-iftalabel>
            <p-select [ngModel]="triggerSelected" (ngModelChange)="triggerChanged($event)" name="disparador" required inputId="input-disparador" [options]="triggers" [fluid]="true" appendTo="body" />
            <label for="input-disparador">Disparador</label>
          </p-iftalabel>
          
          @if (!triggerSelected) {
            <span><small>Selecciona el evento que desencadena esta regla</small></span>
          }
        </div>
      </section>

      @if (triggerSelected) {
          <p-tabs value="0">
            <p-tablist>
              <p-tab value="0">Condición</p-tab>
              <p-tab value="1">Acciones</p-tab>
            </p-tablist>
            <p-tabpanels>
              <p-tabpanel value="0">
                <app-condition [trigger]="triggerSelected" [condicion]="condiciones" (conditionsChanged)="conditionsChanged($event)" />
              </p-tabpanel>
              <p-tabpanel value="1">
                <app-actions [actions]="acciones" (actionsChanged)="actionsChanged($event)" />
              </p-tabpanel>
            </p-tabpanels>
          </p-tabs>
      }

      <footer class="flex justify-end">
        <button pButton type="submit" [raised]="true" pTooltip="Guardar regla" (click)="guardarRegla()" [disabled]="savingRule()">
          <i class="pi pi-file-plus"></i>
          <span>Guardar</span>
        </button>
      </footer>
    </div>
  `,
  imports: [ ActionsComponent, ButtonModule, ConditionComponent, FormsModule, IftaLabelModule, InputTextModule, SelectModule, TabsModule, TooltipModule ]
})
export class RuleFormComponent implements OnInit {

  @Input() ruleSelected: Rule | null = null
  @Output() saved = new EventEmitter<Rule>()

  savingRule = signal(false)

  nombreRegla = ''
  descripcionRegla = ''

  triggers = ['CLIENTE_CREADO', 'PAGO_RECIBIDO', 'TICKET_SIN_RESPUESTA']
  triggerSelected: DISPARADOR | null = null

  condiciones: Condiciones | null = null
  acciones: Accion[] | null = null

  readonly messageService = inject(MessageService)
  readonly rulesService = inject(RulesService)
  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    if (!this.ruleSelected) return
    if (!this.ruleSelected.disparador) return
    if (!this.ruleSelected.condicion) return
    if (!this.ruleSelected.acciones) return

    this.nombreRegla = this.ruleSelected.nombre
    this.descripcionRegla = this.ruleSelected.descripcion
    this.triggerSelected = this.ruleSelected.disparador.type
    this.condiciones = this.ruleSelected.condicion
    this.acciones = this.ruleSelected.acciones
  }

  guardarRegla() {
    if (this.savingRule()) return

    if (
        !this.nombreRegla.trim() ||
        !this.triggerSelected ||
        !this.condiciones ||
        this.condiciones.condiciones.length === 0 ||
        !this.acciones ||
        this.acciones.length === 0
    ) {
      if(
        !this.condiciones ||
        this.condiciones.condiciones.length === 0
      ) return this.messageService.add({severity: 'info', summary: 'Debe registrar al menos una condición'})
      if(
        !this.acciones ||
        this.acciones.length === 0
      ) return this.messageService.add({severity: 'info', summary: 'Debe registrar al menos una acción'})
      return
    }

    const payload: GuardarReglaRequest = {
      nombre: this.nombreRegla.trim(),
      descripcion: this.descripcionRegla.trim(),
      enabled: this.ruleSelected?.enabled ?? true,

      disparador: {
          type: this.triggerSelected
      },

      condicion: {
          declaracion: this.condiciones.declaracion,
          condiciones: this.condiciones.condiciones.map(condicion => ({
              campo: condicion.campo,
              operador: condicion.operador,
              keyword: condicion.keyword.trim()
          }))
      },

      acciones: structuredClone(this.acciones)
    }

    const request$ = this.ruleSelected
      ? this.rulesService.updateRule(this.ruleSelected.id, payload)
      : this.rulesService.createRule(payload)

    this.savingRule.set(true)

    request$.pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo guardar la regla',
        })
        return EMPTY
      }),
      finalize(() => this.savingRule.set(false)),
    ).subscribe(rule => {
      this.messageService.add({
        severity: 'success',
        summary: 'Regla guardada',
      })

      this.saved.emit(rule)
    })

  }

  triggerChanged(trigger: DISPARADOR) {
    this.triggerSelected = trigger
  }

  conditionsChanged(conditions: Condiciones) {
    this.condiciones = conditions
  }

  actionsChanged(actions: Accion[]) {
    this.acciones = [...actions]
  }

}
