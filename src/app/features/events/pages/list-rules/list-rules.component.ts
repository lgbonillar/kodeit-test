import { Component, signal } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DataViewModule } from 'primeng/dataview'
import { TooltipModule } from 'primeng/tooltip'

@Component({
  selector: 'app-list-rules',
  templateUrl: './list-rules.component.html',
  imports: [ ButtonModule, DataViewModule, TooltipModule ]
})
export default class ListRulesComponent {

  rules = signal([])

  showDialog() {
    return
  }

}
