import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { DisparadorService } from "../services/disparador.service";

@Component({
    selector: 'app-condicion',
    template: `
            <div>
                <p-select [options]="campo" [(ngModel)]="campoSeleccionado" placeholder="Seleccione el campo" />
                <p-select [options]="operador" [(ngModel)]="operadorSeleccionada" placeholder="Operador" />
            </div>
            
            <p-button icon="pi pi-times" [rounded]="true" [text]="true" severity="danger" (click)="eliminar()" />
        
    `,
    imports: [ SelectModule, ButtonModule, FormsModule ]
})
export class CondicionComponent {

    @Input() campoSeleccionado!: string
    @Input() operadorSeleccionada!: string
    @Output() eliminarCondicion = new EventEmitter(false)

    campo = [ 'Seleccionar', 'País', 'Plan' ]
    operador = [ 'Seleccionar', 'es igual a', 'contiene' ]

    eliminar() {
        this.eliminarCondicion.emit(true)
    }

}