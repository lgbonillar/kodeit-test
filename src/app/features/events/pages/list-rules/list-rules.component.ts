import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DataViewModule } from 'primeng/dataview'
import { TooltipModule } from 'primeng/tooltip'
import { RulesService } from '../../service/rules.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize } from 'rxjs'
import { Rule } from '../../../../../models/rule'
import { CheckboxModule } from 'primeng/checkbox'
import { FormsModule } from '@angular/forms'
import { TagModule } from 'primeng/tag'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { ConfirmationService } from 'primeng/api'
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

  visible = false
  ruleSelected: Rule | null = null

  private readonly confirmationService = inject(ConfirmationService);
  private readonly rulesService = inject(RulesService)
  private readonly destroyRef = inject(DestroyRef)

  ngOnInit (): void {
    this.initRules()
  }

  showDialog(): void {
    return
  }

  abrirFormulario(regla: Rule) {
    this.ruleSelected = structuredClone(regla)
    this.visible = true;
  }

  cambiarEstadoRegla (enabled: boolean, id: string): void {
    const listaActualizada = this.rules().map(regla => regla.id === id ? { ...regla, enabled } : regla)
    this.rules.set(listaActualizada)
  }

  confirmarEliminacion (event: MouseEvent, rule: Rule): void {
    this.confirmationService.confirm({
      target: event.currentTarget as HTMLElement,
      accept: () => this.eliminarRegla(rule)
    })
  }

  eliminarRegla (item: Rule): void {
    this.rules.set(this.rules().filter(
      rule => rule.id !== item.id
    ))
  }

  private initRules (): void {
    this.rulesService.getRules()
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError(() => {
            return EMPTY
          }),
          finalize(() => this.loadingRules.set(false))
        )
        .subscribe(rules => this.rules.set(rules))
  }

}
