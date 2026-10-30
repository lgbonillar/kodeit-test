import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from "primeng/tooltip";
import { CampoDisponible, Condicion, TipoCampo } from "../models/disparador";

export interface AgregarCondicion { campo: string, operador: string, keyword: string }

@Component({
    selector: 'app-condicion',
    template: `
        <div ngForm #condicionForm="ngForm" class="condition-container">
            <span>Condición</span>

            <div class="condition-form">
                <div class="condition-form--input-container">
                    <p-iftalabel class="campo">
                        <p-select [ngModel]="campoSeleccionado" (ngModelChange)="cambiarCampo($event)" required name="campo" inputId="condicion-campo" [options]="campos" optionLabel="nombre" [fluid]="true" appendTo="body" />
                        <label for="condicion-campo">Campo</label>
                    </p-iftalabel>

                    <p-iftalabel class="campo">
                        <p-select [(ngModel)]="operadorSeleccionado" required name="operador" inputId="condicion-operador" [options]="operadoresDisponibles" [fluid]="true" appendTo="body" [disabled]="!campoSeleccionado" />
                        <label for="condicion-operador">Operador</label>
                    </p-iftalabel>
                </div>


                <p-iftalabel class="campo-nombre">
                    <input pInputText id="rule-keyword" required name="keyword" [(ngModel)]="keyword" autocomplete="off" style="width: 100%;" />
                    <label for="rule-keyword">Keyword</label>
                </p-iftalabel>
            </div>

            <p-button label="Insertar" severity="secondary" [disabled]="!condicionForm.valid" (click)="insertarCondicion()" />
        </div>
        
    `,
    styles: `

        :host {
            display: block;
            min-width: 0;
        }

        .condition-container {
            display: flex;
            align-items: flex-start;
            gap: 3rem;
            min-width: 0;
        }

        .condition-container > span,
        .condition-container > p-button {
            flex-shrink: 0;
        }

        .condition-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            flex: 1;
            min-width: 0;
        }

        .condition-form--input-container {
            display: flex;
            gap: 1rem;
            min-width: 0;
        }

        .campo {
            display: block;
            flex: 1;
            min-width: 0;
        }

        .campo-nombre {
            display: block;
            min-width: 0;
        }

        #rule-keyword {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
        }
    `,
    imports: [ SelectModule, ButtonModule, FormsModule, InputTextModule, IftaLabelModule, TooltipModule ]
})
export class CondicionComponent implements OnChanges {

    @Input() campos: CampoDisponible[] = []
    @Output() agregarCondicion = new EventEmitter<Condicion>()

    campoSeleccionado: CampoDisponible  | null = null
    operadorSeleccionado: string | null = null

    private operadoresPorTipo: Record<TipoCampo, string[]> = {
        texto: ['es igual a', 'contiene'],
        numero: ['es igual a', 'mayor que', 'menor que']
    }

    get operadoresDisponibles(): string[] {
        return this.campoSeleccionado
            ? this.operadoresPorTipo[this.campoSeleccionado.type]
            : []
        }

    cambiarCampo(campo: CampoDisponible | null): void {
        this.campoSeleccionado = campo
        this.operadorSeleccionado = null
        this.keyword = ''
    }

    keyword = ''

    insertarCondicion () {
        if (
            !this.campoSeleccionado ||
            !this.operadorSeleccionado ||
            !this.keyword.trim()
        ) {
            return;
        }

        this.agregarCondicion.emit({
            campo: this.campoSeleccionado.nombre,
            operador: this.operadorSeleccionado,
            keyword: this.keyword
        });

        this.keyword = '';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['campos']) {
            this.cambiarCampo(null)
        }
    }

}