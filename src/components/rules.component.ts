import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { Disparador } from "../models/disparador";
import { DisparadorComponent } from "./disparador.component";
import { DisparadorService } from "../services/disparador.service";
import { Rule } from "../models/rule";

@Component({
    selector: "app-rules",
    styles: `
        .informacion {
            align-items: center;
            display: flex;
            gap: 1rem;
            justify-content: space-between;
        }

        .tarjeta {
            margin-bottom: 1rem;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    `,
    template: `
        <section>

        <header class="header">
            <h1>Hola desde rules</h1>

            <button pButton>
                <i class="pi pi-check" pButtonIcon></i>
                <span pButtonLabel>Crear nuevo</span>
            </button>
        </header>



            @for (regla of reglas; track regla.id) {
                <p-card [header]="regla.nombre" class="tarjeta">
                    <div class="informacion">
                        <p class="m-0">
                            {{ regla.descripcion }}
                        </p>
                        <div class="card flex justify-center">
                            <button pButton (click)="editarRegla(regla)">
                                <i class="pi pi-check" pButtonIcon></i>
                                <span pButtonLabel>Editar</span>
                            </button>
                        </div>
                    </div>
                </p-card>
            }
        </section>


        <p-dialog header="Edit Profile" [modal]="true" [(visible)]="visible" [style]="{ width: '80%', height: '20rem' }">
            <app-disparador />
        </p-dialog>
    `,
    imports: [ ButtonModule, CommonModule, CardModule, DialogModule, DisparadorComponent  ]
})
export class RulesComponent implements OnInit {

    reglas: Rule[] = []
    visible: boolean = true;

    disparadorService = inject(DisparadorService)

    showDialog() {
        this.visible = true;
    }

    private readonly http = inject(HttpClient)

    ngOnInit (): void {
        this.http.get('/res.json').subscribe((response: any) => {
                        console.log("response: ", response)

            this.reglas = response
            console.log(this.reglas)
        })
    }

    editarRegla(regla: Rule) {
        this.disparadorService.reglaSeleccionada = regla
        console.log('Regla seleccionada', this.disparadorService.reglaSeleccionada)
        this.visible = true;
    }

}