import { Injectable } from "@angular/core";
import { Rule } from "../models/rule";

@Injectable({
    providedIn: 'root'
})
export class DisparadorService {
    reglaSeleccionada: Rule | null = null

    tipoDeDisparador (): void {

    }
}
