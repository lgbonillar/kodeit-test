import { Component, Input } from '@angular/core'
import { Rule } from '../../../../models/rule'
import { IftaLabelModule } from 'primeng/iftalabel'
import { SelectModule } from 'primeng/select'
import { FormsModule } from '@angular/forms'
import { Condicion, DISPARADOR } from '../../../../models/disparador'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip'
import { TabsModule } from 'primeng/tabs'
import { ConditionComponent } from './condition.component'

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
                <app-condition [trigger]="triggerSelected" (conditionsChanged)="conditionsChanged($event)" />
              </p-tabpanel>
              <p-tabpanel value="1">
              </p-tabpanel>
            </p-tabpanels>
          </p-tabs>
      }

      <footer class="flex justify-end">
        <button pButton type="submit" [raised]="true" pTooltip="Guardar regla">
          <i class="pi pi-file-plus"></i>
          <span>Guardar</span>
        </button>
      </footer>
    </div>
  `,
  imports: [ ButtonModule, ConditionComponent, FormsModule, IftaLabelModule, InputTextModule, SelectModule, TabsModule, TooltipModule ]
})
export class RuleFormComponent {

  @Input() ruleSelected: Rule | null = null

  nombreRegla = ''
  descripcionRegla = ''

  triggers = ['CLIENTE_CREADO', 'PAGO_RECIBIDO', 'TICKET_SIN_RESPUESTA']
  triggerSelected: DISPARADOR | null = null

  condiciones: Condicion[] | null = null

  triggerChanged(trigger: DISPARADOR) {
    this.triggerSelected = trigger
  }

  conditionsChanged(conditions: Condicion[]) {
    this.condiciones = [...conditions]
  }

}
