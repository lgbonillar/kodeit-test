export type Accion =
  | {
      tipo: 'email'
      destinatario: string
      asunto: string
      cuerpo: string
    }
  | {
      tipo: 'sms'
      telefono: string
      mensaje: string
    }
  | {
      tipo: 'webhook'
      url: string
      metodo: 'POST' | 'PUT'
    }

export type TipoAccion = Accion['tipo']

export type EmailAction = Extract<Accion, { tipo: 'email' }>
export type SmsAction = Extract<Accion, { tipo: 'sms' }>
export type WebhookAction = Extract<Accion, { tipo: 'webhook' }>
