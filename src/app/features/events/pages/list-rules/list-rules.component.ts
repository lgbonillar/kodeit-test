import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DataViewModule } from 'primeng/dataview'
import { TooltipModule } from 'primeng/tooltip'
import { RulesService } from '../../service/rules.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize } from 'rxjs'
import { GuardarReglaRequest, Rule } from '../../models/rule'
import { CheckboxModule } from 'primeng/checkbox'
import { FormsModule } from '@angular/forms'
import { TagModule } from 'primeng/tag'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { ConfirmationService, MessageService } from 'primeng/api'
import { DialogModule } from 'primeng/dialog'
import { RuleFormComponent } from '../../components/rule-form.component'

@Component({
  selector: 'app-list-rules',
  templateUrl: './list-rules.component.html',
  imports: [ ButtonModule, CheckboxModule, ConfirmPopupModule, DataViewModule, DialogModule, FormsModule, RuleFormComponent, TagModule, TooltipModule ],
  providers: [ ConfirmationService ]
})
export default class ListRulesComponent implements OnInit {

  loadingRules = signal<boolean>(false)
  rules = signal<Rule[]>([])
  readonly updatingRules = signal<ReadonlySet<string>>(new Set())

  visible = false
  ruleSelected: Rule | null = null

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService)
  private readonly rulesService = inject(RulesService)
  private readonly destroyRef = inject(DestroyRef)

  ngOnInit (): void {
    this.initRules()
  }

  abrirFormulario(regla: Rule | null = null) {
    if (regla) {
      this.ruleSelected = structuredClone(regla)
    } else {
      this.ruleSelected = null
    }

    this.visible = true;
  }

  cambiarEstadoRegla (enabled: boolean, id: string): void {
    if (this.updatingRules().has(id)) return

    const regla = this.rules().find(item => item.id === id)
    if (!regla || enabled === regla.enabled) return
    if (!regla.disparador || !regla.condicion || !regla.acciones) {
      this.messageService.add({ severity: 'error', summary: 'La regla no tiene los datos necesarios para actualizarse' })
      return
    }

    const payload: GuardarReglaRequest = {
      nombre: regla.nombre,
      descripcion: regla.descripcion,
      enabled,
      disparador: { type: regla.disparador.type },
      condicion: regla.condicion,
      acciones: regla.acciones,
    }

    this.updatingRules.update(ids => new Set([...ids, id]))
    this.rules.update(rules => rules.map(item => item.id === id ? { ...item, enabled } : item))

    this.rulesService.updateRule(id, payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.rules.update(rules => rules.map(item => item.id === id ? { ...item, enabled: regla.enabled } : item))
          this.messageService.add({ severity: 'error', summary: 'No se pudo cambiar el estado de la regla' })
          return EMPTY
        }),
        finalize(() => this.updatingRules.update(ids => {
          const siguientes = new Set(ids)
          siguientes.delete(id)
          return siguientes
        })),
      )
      .subscribe(actualizada => {
        this.rules.update(rules => rules.map(item => item.id === id ? actualizada : item))
      })
  }

  confirmarEliminacion (event: MouseEvent, rule: Rule): void {
    this.confirmationService.confirm({
      target: event.currentTarget as HTMLElement,
      accept: () => this.eliminarRegla(rule)
    })
  }

  eliminarRegla (rule: Rule): void {
    this.rulesService.deleteRule(rule.id)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo eliminar la regla',
        })
        return EMPTY
      }),
    )
    .subscribe(() => {
      this.rules.update(rules =>
        rules.filter(item => item.id !== rule.id)
      )
    })
  }

  onRuleSaved(): void {
    this.visible = false
    this.initRules()
  }

  private initRules (): void {
    this.rulesService.getRules()
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError(() => {
            this.messageService.add({ severity: 'error', summary: 'No se pudieron cargas las reglas' })
            return EMPTY
          }),
          finalize(() => this.loadingRules.set(false))
        )
        .subscribe(rules => this.rules.set(rules))
  }

}
