export type DISPARADOR = "CLIENTE_CREADO" | "PAGO_RECIBIDO" | "TICKET_SIN_RESPUESTA"

export interface Condicion {
    id: string
    campo: string
    operador: string
}

export interface Disparador {
    id: string
    type: DISPARADOR
    nombre: string
    condiciones: Condicion[]
}
