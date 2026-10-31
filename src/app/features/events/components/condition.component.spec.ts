import { TestBed } from '@angular/core/testing'
import { ConditionComponent } from './condition.component'

describe('ConditionComponent', () => {
  it('preserves existing conditions on initial load and emits declaration changes', async () => {
    await TestBed.configureTestingModule({ imports: [ConditionComponent] }).compileComponents()
    const fixture = TestBed.createComponent(ConditionComponent)
    const condicion = {
      declaracion: 'all' as const,
      condiciones: [{ campo: 'País', operador: 'es igual a', keyword: 'México' }],
    }
    const emit = vi.spyOn(fixture.componentInstance.conditionsChanged, 'emit')
    fixture.componentRef.setInput('trigger', 'CLIENTE_CREADO')
    fixture.componentRef.setInput('condicion', condicion)
    fixture.detectChanges()
    expect(fixture.componentInstance.condiciones).toEqual(condicion.condiciones)
    expect(emit).not.toHaveBeenCalled()

    fixture.componentInstance.cambiarDeclaracion('any')
    expect(emit).toHaveBeenLastCalledWith({ ...condicion, declaracion: 'any' })

    fixture.componentRef.setInput('trigger', 'PAGO_RECIBIDO')
    fixture.detectChanges()
    expect(emit).toHaveBeenLastCalledWith({ declaracion: 'any', condiciones: [] })
    expect(fixture.componentInstance.condiciones).toEqual([])
  })
})
