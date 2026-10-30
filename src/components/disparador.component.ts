import { Component, Input, OnInit } from '@angular/core';
import { Rule } from '../models/rule';
import { CampoDisponible, Condicion, DISPARADOR } from '../models/disparador';
import { TabsModule } from 'primeng/tabs';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { AgregarCondicion, CondicionComponent } from './condicion.component';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';

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

        .statement-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .statement {
            display: flex;
            gap: 1rem;
        }

        .statement-description {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-left: 1rem;
            gap: 1rem;
            border-left: 1px solid #ececec;
        }

        .statement-description--text {
            display: flex;
            gap: 0.2rem;
        }

        .condiciones {
            display: flex;
            flex-direction: column;
        }
    `,
    template: `
        <form #reglaForm="ngForm" class="regla-card" (ngSubmit)="guardarRegla()">
            <div>
                <p-iftalabel class="campo-nombre">
                    <input pInputText id="rule-name" required name="nombre" [(ngModel)]="nombreRegla" autocomplete="off" style="width: 100%;" />
                    <label for="username">Nombre</label>
                </p-iftalabel>
            </div>

            <div>
                <p-iftalabel class="campo-descripcion">
                    <input pInputText id="rule-name" name="descripcion" [(ngModel)]="descripcionRegla" autocomplete="off" style="width: 100%;" />
                    <label for="username">Descripción</label>
                </p-iftalabel>
            </div>

            <div>
                <p-iftalabel class="campo-disparador">
                    <p-select [ngModel]="triggerSelected" (ngModelChange)="cambiarDisparador($event)" name="disparador" required inputId="input-disparador" [options]="triggers" [fluid]="true" appendTo="body" />
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
                            <div class="statement-container">
                                <div class="statement">
                                    <span>Declaración</span>
                                    <aside class="statement-description">
                                        <div class="statement-description--text">
                                            <p-radiobutton name="statement" value="all" [(ngModel)]="statement" inputId="statement-all" />
                                            <label for="statement-all">TODOS (Filtrar si se cumplen TODAS las siguientes condiciones)</label>
                                        </div>
                                        <div class="statement-description--text">
                                            <p-radiobutton name="statement" value="any" [(ngModel)]="statement" inputId="statement-any" />
                                            <label for="statement-any">CUALQUIERA (Filtrar si se cumple ALGUNA de las siguientes condiciones)</label>
                                        </div>
                                    </aside>
                                </div>
                                <div class="condition">
                                    <app-condicion
                                        [campos]="camposDisponibles"
                                        (agregarCondicion)="agregarCondicion($event)"
                                    />
                                </div>
                                <div class="condiciones">
                                    @for (condicion of condiciones; track condicion.keyword) {
                                        <span>El campo {{ condicion.campo }} {{ condicion.operador }} <strong>{{ condicion.keyword }}</strong> </span>
                                    }
                                </div>
                            </div>
                        </p-tabpanel>
                        <p-tabpanel value="1">
                            <span>tab 2</span>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
                }
            </div>

            <div style="align-self: flex-end;">
                <p-button type="submit" icon="pi pi-file-plus" label="Guardar" [raised]="true" pTooltip="Guardar regla" [disabled]="!reglaForm.valid || condiciones.length === 0" />
            </div>
        </form>
    `,
    imports: [ ButtonModule, TabsModule, CondicionComponent, FormsModule, SelectModule, InputTextModule, RadioButtonModule, IftaLabelModule, FormsModule, TooltipModule ]
})
export class DisparadorComponent implements OnInit {

    @Input() regla: Rule | null = null;

    triggers = ['CLIENTE_CREADO', 'PAGO_RECIBIDO', 'TICKET_SIN_RESPUESTA']
    triggerSelected: DISPARADOR | null = null

    nombreRegla = ''
    descripcionRegla = ''
    statement = 'all'

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
    };

    get camposDisponibles(): CampoDisponible[] {
        return this.triggerSelected
            ? this.camposPorDisparador[this.triggerSelected]
            : [];
    }

    ngOnInit(): void {
        this.prepararFormulario();
    }

    prepararFormulario () {
        this.limpiarFormulario();

        const regla = this.regla

        if (!regla) return

        this.nombreRegla = regla.nombre
        this.descripcionRegla = regla.descripcion
        this.triggerSelected = regla.disparador?.type ?? null
        
        if (regla.condicion) {
            this.statement = regla.condicion.declaracion
            this.condiciones = regla.condicion.condiciones
        }
    }

    guardarRegla() {
        if (
            !this.nombreRegla.trim() ||
            !this.triggerSelected ||
            this.condiciones.length === 0
        ) {
            return;
        }

        console.log('Agregada!!', this.regla)
    }

    agregarCondicion(condicion: AgregarCondicion) {
        this.condiciones.push(condicion)
    }

    limpiarFormulario() {
        this.nombreRegla = ''
        this.descripcionRegla = ''
        this.triggerSelected = null
        this.statement = 'all'
        this.condiciones = []
    }

    cambiarDisparador(disparador: DISPARADOR | null): void {
        this.triggerSelected = disparador;
        this.condiciones = [];
    }

}
