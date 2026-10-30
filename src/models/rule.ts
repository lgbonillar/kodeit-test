import { Condicion, Disparador } from "./disparador"

export interface Rule {
    id: string
    nombre: string
    descripcion: string
    enabled: boolean,
    disparador?: Disparador
    condiciones?: Condicion
}
