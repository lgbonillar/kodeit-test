import { Condicion, Condiciones, DISPARADOR, Disparador } from './disparador'
import { Accion } from './accion'

export interface Rule {
    id: string
    nombre: string
    descripcion: string
    enabled: boolean,
    disparador?: Disparador
    condicion?: Condiciones
    acciones?: Accion[]
}

export interface GuardarReglaRequest {
  id?: string
  nombre: string
  descripcion: string
  enabled: boolean
  disparador: {
    type: DISPARADOR
  };
  condicion: {
    declaracion: 'all' | 'any'
    condiciones: Condicion[]
  };
  acciones: Accion[]
}
