import { Component, inject } from '@angular/core';
import { Condicion, DISPARADOR } from '../models/disparador';
import { TabsModule } from 'primeng/tabs';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CondicionComponent } from './condicion.component';
import { DisparadorService } from '../services/disparador.service';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-disparador',
    styles: `
        .regla-card {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .campo-disparador {
            display: block;
            width: 20rem;
            max-width: 100%;
        }

        .campo-nombre, .campo-descripcion {
            display: block;
            width: 20rem;
            max-width: 100%;
        }
    `,
    template: `
        <div class="regla-card">
            <div>
                <p-iftalabel class="campo-nombre">
                    <input pInputText id="rule-name" [(ngModel)]="nombreRegla" autocomplete="off" style="width: 100%;" />
                    <label for="username">Nombre</label>
                </p-iftalabel>
            </div>

            <div>
                <p-iftalabel class="campo-descripcion">
                    <input pInputText id="rule-name" [(ngModel)]="descripcionRegla" autocomplete="off" style="width: 100%;" />
                    <label for="username">Descripción</label>
                </p-iftalabel>
            </div>

            <div>
                <p-iftalabel class="campo-disparador">
                    <p-select [(ngModel)]="triggerSelected" inputId="input-disparador" [options]="triggers" [fluid]="true" appendTo="body" />
                    <label for="dd-city">Disparador</label>
                </p-iftalabel>
    
                <span><small>Selecciona el evento que desencadena esta regla</small></span>
            </div>

            <div>
                @if (triggerSelected) {

                <p-tabs value="0">
                    <p-tablist>
                        <p-tab value="0">Condición</p-tab>
                        <p-tab value="1">Acciones</p-tab>
                    </p-tablist>
                    <p-tabpanels>
                        <p-tabpanel value="0">
                            <app-condicion />
                            <span>tab 1</span>
                        </p-tabpanel>
                        <p-tabpanel value="1">
                            <span>tab 2</span>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
                }
            </div>
        </div>
    `,
    imports: [ ButtonModule, TabsModule, CondicionComponent, FormsModule, SelectModule, SelectModule, InputTextModule, IftaLabelModule, FormsModule ]
})
export class DisparadorComponent {

    triggers = ['CLIENTE_CREADO', 'PAGO_RECIBIDO', 'TICKET_SIN_RESPUESTA']
    triggerSelected!: DISPARADOR

    nombreRegla = ''
    descripcionRegla = ''

    condicionEdicion: Condicion[] = [

    ]

    condiciones: Condicion[] = []

    disparadorService = inject(DisparadorService)

}
