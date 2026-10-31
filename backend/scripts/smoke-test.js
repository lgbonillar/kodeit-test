import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const base = process.env.API_URL ?? 'http://localhost:3000/api/reglas'
const mock = JSON.parse(await readFile(new URL('../../public/mock.json', import.meta.url), 'utf8'))
const payload = structuredClone(mock[0])
delete payload.id
payload.nombre = 'Prueba temporal del backend'
payload.disparador = { type: payload.disparador.type }
const request = (method, path = '', body) => fetch(base + path, {
  method,
  headers: { 'Content-Type': 'application/json' },
  body: body === undefined ? undefined : JSON.stringify(body),
})
let id
try {
  const listado = await request('GET')
  assert.equal(listado.status, 200)
  const iniciales = await listado.json()
  assert.ok(Array.isArray(iniciales))
  const creado = await request('POST', '', payload)
  assert.equal(creado.status, 201)
  const regla = await creado.json()
  id = regla.id
  assert.ok(id)
  assert.equal(regla.disparador.type, payload.disparador.type)
  assert.deepEqual(regla.acciones, payload.acciones)
  assert.deepEqual(regla.condicion, payload.condicion)
  const cambio = { ...payload, id, nombre: 'Prueba actualizada', enabled: false }
  const actualizado = await request('PUT', `/${id}`, cambio)
  assert.equal(actualizado.status, 200)
  assert.equal((await actualizado.json()).enabled, false)
  const posteriores = await (await request('GET')).json()
  assert.equal(posteriores.find(r => r.id === id).nombre, cambio.nombre)
  assert.equal((await request('POST', '', {})).status, 400)
  assert.equal((await request('POST', '', { ...payload, disparador: { type: 'INVALIDO' } })).status, 400)
  assert.equal((await request('DELETE', '/invalido')).status, 400)
  const inexistente = '/ffffffff-ffff-4fff-8fff-ffffffffffff'
  assert.equal((await request('PUT', inexistente, payload)).status, 404)
  assert.equal((await request('DELETE', inexistente)).status, 404)
  const jsonInvalido = await fetch(base, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
  })
  assert.equal(jsonInvalido.status, 400)
  assert.equal((await request('DELETE', `/${id}`)).status, 204)
  id = undefined
  const finales = await (await request('GET')).json()
  assert.equal(finales.length, iniciales.length)
  console.log(`CRUD y validaciones correctos. ${finales.length} reglas al finalizar.`)
} finally {
  if (id) await request('DELETE', `/${id}`)
}
