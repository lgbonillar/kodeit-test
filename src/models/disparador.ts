export type DISPARADOR = 'CLIENTE_CREADO' | 'PAGO_RECIBIDO' | 'TICKET_SIN_RESPUESTA'
export type CLIENTE_CREADO_CAMPOS = 'PAIS' | 'PLAN'
export type OPERADORES_TEXTO = 'ES_IGUAL_A' | 'CONTIENE'

export type TipoCampo = 'texto' | 'numero';

export interface CampoDisponible {
  nombre: string;
  type: TipoCampo;
}

export interface Condicion {
    campo: string
    operador: string
    keyword: string
}
export interface Condiciones {
    declaracion: string
    condiciones: Condicion[]
}

export interface Disparador {
    id: string
    nombre: string
    type: DISPARADOR
}
