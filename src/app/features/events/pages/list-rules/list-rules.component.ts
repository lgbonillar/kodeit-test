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

@Component({
  selector: 'app-list-rules',
  templateUrl: './list-rules.component.html',
  imports: [ ButtonModule, CheckboxModule, DataViewModule, FormsModule, TagModule, TooltipModule ]
})
export default class ListRulesComponent implements OnInit {

  loadingRules = signal<boolean>(false)
  rules = signal<Rule[]>([])

  private readonly rulesService = inject(RulesService)
  private readonly destroyRef = inject(DestroyRef)

  ngOnInit (): void {
    this.initRules()
  }

  showDialog(): void {
    return
  }

  cambiarEstadoRegla (enabled: boolean, id: string): void {
    const listaActualizada = this.rules().map(regla => regla.id === id ? { ...regla, enabled } : regla)
    this.rules.set(listaActualizada)
  }

  eliminarRegla (index: number): void {
    this.rules.set(this.rules().filter(
        (_, posicion) => posicion !== index
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
