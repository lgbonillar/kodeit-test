import { Injectable } from "@angular/core";
import { Rule } from "../models/rule";

@Injectable({
    providedIn: 'root'
})
export class DisparadorService {
    reglaSeleccionada!: Rule

    tipoDeDisparador (): number {
        if (this.reglaSeleccionada.disparador?.type === 'CLIENTE_CREADO')
            return 0
        else if (this.reglaSeleccionada.disparador?.type === 'PAGO_RECIBIDO')
            return 1
        else if (this.reglaSeleccionada.disparador?.type === 'TICKET_SIN_RESPUESTA')
            return 2
        else return 0
    }
}
