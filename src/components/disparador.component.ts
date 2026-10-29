import { Component, inject, Input, OnInit } from '@angular/core';
import { Condicion, Disparador } from '../models/disparador';
import { TabsModule } from 'primeng/tabs';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CondicionComponent } from './condicion.component';
import { DisparadorService } from '../services/disparador.service';

@Component({
    selector: 'app-disparador',
    styles: `
        .condiciones {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
        }
    `,
    template: `
        <div class="card">
            <p-tabs [(value)]="tabNumber">
                <p-tablist>
                    <p-tab value="0">Cliente creado</p-tab>
                    <p-tab value="1">Pago Recibido</p-tab>
                    <p-tab value="2">Ticket sin respuesta</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <p-button label="Agregar condición" (onClick)="agregarCondicionNueva()" />

                        <div class="condiciones">

                        @if (this.disparadorService.reglaSeleccionada && this.disparadorService.reglaSeleccionada.disparador) {
                            @for (condicion of this.disparadorService.reglaSeleccionada.disparador.condiciones; track condicion.id) {
                                <app-condicion [campoSeleccionado]="condicion.campo" [operadorSeleccionada]="condicion.operador" (eliminar)="eliminarCondicion($event, condicion)" />
                            }
                        }
                            

                        </div>

                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <p class="m-0">
                            PAGO RECIBIDO
                        </p>
                    </p-tabpanel>
                    <p-tabpanel value="2">
                        <p class="m-0">
                            TICKET_RECIBIDO
                        </p>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `,
    imports: [ ButtonModule, TabsModule, CondicionComponent, FormsModule, SelectModule  ]
})
export class DisparadorComponent implements OnInit {
    tabNumber: number = 0
    pais: string = ''
    plan: string = ''

    condiciones: Condicion[] = []

    disparadorService = inject(DisparadorService)

    ngOnInit(): void {

    }

    agregarCondicionNueva () {
        if (this.disparadorService.reglaSeleccionada.disparador!.condiciones.some(condicion => condicion.id === 'not-defined')) {
            return
        }

        this.disparadorService.reglaSeleccionada.disparador!.condiciones.push({
            id: 'not-defined',
            campo: 'Seleccionar',
            operador: 'Seleccionar'
        })
    }

    eliminarCondicion(eliminar: any, condicion: Condicion) {
        this.disparadorService.reglaSeleccionada.disparador!.condiciones.pop()
    }

}
