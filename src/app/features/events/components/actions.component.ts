import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { IftaLabelModule } from 'primeng/iftalabel'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { TextareaModule } from 'primeng/textarea'
import { Accion, EmailAction, SmsAction, WebhookAction } from '../models/accion'
import { AccordionModule } from 'primeng/accordion';
import { ChipModule } from 'primeng/chip'

@Component({
  selector: 'app-actions',
  template: `
    <div class="actions-accordion max-h-125 overflow-y-auto">
      <p-accordion [multiple]="true">
        <p-accordion-panel value="0">
          <p-accordion-header>
            <ng-template #toggleicon let-active="active">
                @if (active) {
                    <i class="pi pi-minus"></i>
                } @else {
                    <i class="pi pi-plus"></i>
                }
            </ng-template>
            <span class="flex items-center gap-2 w-full">
              Email <small> A enviar: {{ emails.length }}</small>
            </span>
          </p-accordion-header>
          <p-accordion-content>
            <div class="flex flex-col gap-4">
              <form #emailForm="ngForm" class="flex flex-col gap-4">
                <p-iftalabel>
                  <input
                      pInputText
                      id="accion-destinatario"
                      name="destinatario"
                      [(ngModel)]="destinatario"
                      type="email"
                      email
                      required
                      class="w-full"
                  />
                  <label for="accion-destinatario">Destinatario</label>
                </p-iftalabel>
              
                <p-iftalabel>
                  <input
                      pInputText
                      id="accion-asunto"
                      name="asunto"
                      [(ngModel)]="asunto"
                      required
                      pattern=".*\\S.*"
                      class="w-full"
                  />
                  <label for="accion-asunto">Asunto</label>
                </p-iftalabel>
              
                <div class="flex gap-4 items-center">
                  <p-iftalabel class="flex-1">
                    <textarea
                        pTextarea
                        id="accion-cuerpo"
                        name="cuerpo"
                        [(ngModel)]="cuerpo"
                        required
                        pattern="[\\s\\S]*\\S[\\s\\S]*"
                        rows="5"
                        class="w-full"
                    ></textarea>
                    <label for="accion-cuerpo">Cuerpo</label>
                  </p-iftalabel>

                  <button pButton severity="secondary" [disabled]="!emailForm.valid" (click)="insertMail()" class="shrink-0" >
                    <span>Guardar</span>
                  </button>
                </div>
              </form>
              <div class="flex flex-col gap-1 items-start">
                @for (email of emails; track email; let i = $index) {
                <p-chip [removable]="true" (onRemove)="removeEmail(i)">
                  <span class="text-sm">
                    Se enviará un email a <strong> {{ email.destinatario }} </strong>
                  </span>
                </p-chip>
                }
              </div>
            </div>
          </p-accordion-content>
        </p-accordion-panel>
        <p-accordion-panel value="1">
          <p-accordion-header>
            <ng-template #toggleicon let-active="active">
                @if (active) {
                    <i class="pi pi-minus"></i>
                } @else {
                    <i class="pi pi-plus"></i>
                }
            </ng-template>
            <span class="flex items-center gap-2 w-full">
              SMS <small> A enviar: {{ sms.length }}</small>
            </span>
          </p-accordion-header>
          <p-accordion-content>
            <div class="flex flex-col gap-4">
              <form #smsForm="ngForm" class="flex flex-col gap-4">
                <p-iftalabel>
                  <input
                      pInputText
                      id="accion-telefono"
                      name="telefono"
                      [(ngModel)]="telefono"
                      type="tel"
                      pattern="[+]?[0-9]{7,15}"
                      class="w-full"
                      required
                  />
                  <label for="accion-telefono">Número telefónico</label>
                </p-iftalabel>

                <div class="flex gap-4 items-center">
                  <div class="flex-1">
                    <p-iftalabel>
                      <textarea pTextarea
                          id="accion-mensaje"
                          name="mensaje"
                          [(ngModel)]="mensaje"
                          required
                          maxlength="160"
                          pattern="[\\s\\S]*\\S[\\s\\S]*"
                          class="w-full"
                          rows="3"
                      ></textarea>
                      <label for="accion-mensaje">Mensaje</label>
                    </p-iftalabel>
                    
                    <small class="text-xs">{{ mensaje?.length ?? 0 }}/160 caracteres</small>
                  </div>

                  <button pButton severity="secondary" [disabled]="!smsForm.valid" (click)="insertSms()" class="shrink-0" >
                    <span>Guardar</span>
                  </button>
                </div>
              </form>

              <div class="flex flex-col gap-1 items-start">
                @for (sm of sms; track sm; let i = $index) {
                <p-chip [removable]="true" (onRemove)="removeSms(i)">
                  <span class="text-sm">
                    Se enviará un sms a <strong> {{ sm.telefono }} </strong>
                  </span>
                </p-chip>
                }
              </div>
            </div>
          </p-accordion-content>
        </p-accordion-panel>
        <p-accordion-panel value="3">
          <p-accordion-header>
            <ng-template #toggleicon let-active="active">
                @if (active) {
                    <i class="pi pi-minus"></i>
                } @else {
                    <i class="pi pi-plus"></i>
                }
            </ng-template>
            <span class="flex items-center gap-2 w-full">
              Webhook <small> A enviar: {{ webhooks.length }}</small>
            </span>
          </p-accordion-header>
          <p-accordion-content>
            <div class="flex flex-col gap-4">
              <form #webhookForm="ngForm" class="flex flex-col gap-4">
                <p-iftalabel>
                  <input
                      pInputText
                      id="accion-url"
                      name="url"
                      [(ngModel)]="url"
                      type="url"
                      pattern="https?://[^\\s]+"
                      class="w-full"
                      required
                  />
                  <label for="accion-url">URL</label>
                </p-iftalabel>

                <div class="flex gap-4 items-center">
                  <div class="flex-1">
                    <p-iftalabel>
                      <p-select
                        inputId="accion-metodo"
                        name="metodo"
                        [(ngModel)]="metodo"
                        [options]="metodos"
                        [fluid]="true"
                        appendTo="body"
                        required
                      />
                      <label for="accion-metodo">Método</label>
                    </p-iftalabel>
                                      </div>

                  <button pButton severity="secondary" [disabled]="!webhookForm.valid" (click)="insertWebhook()" class="shrink-0" >
                    <span>Guardar</span>
                  </button>
                </div>
              </form>

              <div class="flex flex-col gap-1 items-start">
                @for (webhook of webhooks; track webhook; let i = $index) {
                <p-chip [removable]="true" (onRemove)="removeWebhook(i)">
                  <span class="text-sm">
                    Se enviará el webhook a <strong> {{ webhook.url }} </strong> con <strong> {{ webhook.metodo }} </strong>
                  </span>
                </p-chip>
                }
              </div>
            </div>
          </p-accordion-content>
        </p-accordion-panel>
      </p-accordion>
    </div>
  `,
  imports: [ ChipModule, IftaLabelModule, TextareaModule, InputTextModule, ButtonModule, FormsModule, SelectModule, AccordionModule ]
})
export class ActionsComponent implements OnInit {

  @Input() actions: Accion[] | null = null
  @Output() actionsChanged = new EventEmitter<Accion[]>()

  destinatario = ''
  asunto = ''
  cuerpo = ''

  telefono = ''
  mensaje = ''

  url = ''
  metodo: 'POST' | 'PUT' = 'POST'
  metodos = ['POST', 'PUT']

  emails: EmailAction[] = []
  sms: SmsAction[] = []
  webhooks: WebhookAction[] = []

  ngOnInit(): void {
    if (!this.actions) return

    this.emails = this.actions.filter(item => item.tipo === 'email')
    this.sms = this.actions.filter(item => item.tipo === 'sms')
    this.webhooks = this.actions.filter(item => item.tipo === 'webhook')
  }

  insertMail () {
    this.emails = [...this.emails, {
      tipo: 'email',
      destinatario: this.destinatario,
      asunto: this.asunto,
      cuerpo: this.cuerpo
    }]
    this.destinatario = ''
    this.asunto = ''
    this.cuerpo = ''

    this.emitActions()
  }

  insertSms () {
    this.sms = [...this.sms, {
      tipo: 'sms',
      telefono: this.telefono,
      mensaje: this.mensaje
    }]
    this.telefono = ''
    this.mensaje = ''

    this.emitActions()
  }

  insertWebhook () {
    this.webhooks = [...this.webhooks, {
      tipo: 'webhook',
      url: this.url,
      metodo: this.metodo
    }]
    this.telefono = ''
    this.mensaje = ''

    this.emitActions()
  }

  removeEmail (indice: number) {
    this.emails = this.emails.filter(
        (_, posicion) => posicion !== indice
    )
    this.emitActions()
  }

  removeSms (indice: number) {
    this.sms = this.sms.filter(
        (_, posicion) => posicion !== indice
    )
    this.emitActions()
  }

  removeWebhook (indice: number) {
    this.webhooks = this.webhooks.filter(
        (_, posicion) => posicion !== indice
    )
    this.emitActions()
  }

  private emitActions(): void {
    this.actionsChanged.emit([
      ...this.emails,
      ...this.sms,
      ...this.webhooks,
    ])
  }

}
