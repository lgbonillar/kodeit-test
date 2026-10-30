import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from "primeng/tooltip";

export interface AgregarCondicion { campo: string, operador: string, keyword: string }

@Component({
    selector: 'app-condicion',
    template: `
        <form #condicionForm="ngForm" class="condition-container">
            <span>Condición</span>

            <div class="condition-form">
                <div class="condition-form--input-container">
                    <p-iftalabel class="campo">
                        <p-select [(ngModel)]="campoSeleccionado" required name="campo" inputId="input-disparador" [options]="campo" [fluid]="true" appendTo="body" />
                        <label for="dd-city">Campo</label>
                    </p-iftalabel>
                    <!--p-select [options]="campo" [(ngModel)]="campoSeleccionado" placeholder="Campo" appendTo="body" /-->

                    <p-iftalabel class="campo">
                        <p-select [(ngModel)]="operadorSeleccionado" required name="operador" inputId="input-disparador" [options]="operador" [fluid]="true" appendTo="body" />
                        <label for="dd-city">Operador</label>
                    </p-iftalabel>

                    <!--p-select [options]="operador" [(ngModel)]="operadorSeleccionada" placeholder="Condición" appendTo="body" /-->
                </div>


                <p-iftalabel class="campo-nombre">
                    <input pInputText id="rule-keyword" required name="keyword" [(ngModel)]="keyword" autocomplete="off" style="width: 100%;" />
                    <label for="rule-keyword">Keyword</label>
                </p-iftalabel>
                <!--p-button icon="pi pi-times" [rounded]="true" [text]="true" severity="danger" (click)="eliminar()" /-->
            </div>

            <p-button label="Insertar" severity="secondary" [disabled]="!condicionForm.valid" (click)="insertarCondicion()" />
        </form>
        
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
export class CondicionComponent {

    @Input() campoSeleccionado!: string
    @Input() operadorSeleccionado!: string
    @Output() eliminarCondicion = new EventEmitter(false)
    @Output() agregarCondicion = new EventEmitter<AgregarCondicion>()

    campo = ['País', 'Plan' ]
    operador = ['es igual a', 'contiene' ]

    keyword = ''

    insertarCondicion () {
        this.agregarCondicion.emit({
            campo: this.campoSeleccionado,
            operador: this.operadorSeleccionado,
            keyword: this.keyword
        })

        this.keyword = ''
    }

    eliminar() {
        this.eliminarCondicion.emit(true)
    }

}