import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { MessageService } from 'primeng/api'
import { RuleFormComponent } from './rule-form.component'
import { environment } from '../../../../environments/environment'

describe('RuleFormComponent', () => {
  it('blocks duplicate saves and allows retry after an HTTP error', async () => {
    await TestBed.configureTestingModule({
      imports: [RuleFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).overrideComponent(RuleFormComponent, { set: { template: '', imports: [] } }).compileComponents()
    const fixture = TestBed.createComponent(RuleFormComponent)
    const component = fixture.componentInstance
    const http = TestBed.inject(HttpTestingController)
    component.nombreRegla = 'Regla de prueba'
    component.triggerSelected = 'CLIENTE_CREADO'
    component.condiciones = {
      declaracion: 'all',
      condiciones: [{ campo: 'País', operador: 'es igual a', keyword: 'México' }],
    }
    component.acciones = [{ tipo: 'sms', telefono: '+525500000000', mensaje: 'Prueba' }]
    component.guardarRegla()
    component.guardarRegla()
    expect(component.savingRule()).toBe(true)
    const first = http.expectOne(`${environment.apiUrl}/reglas`)
    expect(first.request.method).toBe('POST')
    first.flush({ message: 'Error de prueba' }, { status: 500, statusText: 'Server Error' })
    expect(component.savingRule()).toBe(false)
    component.guardarRegla()
    const retry = http.expectOne(`${environment.apiUrl}/reglas`)
    retry.flush({ ...retry.request.body, id: '00000000-0000-4000-8000-000000000099' })
    expect(component.savingRule()).toBe(false)
    http.verify()
  })
})
