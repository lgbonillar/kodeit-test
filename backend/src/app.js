import express from 'express'
import cors from 'cors'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const texto = value => typeof value === 'string' && value.trim().length > 0
const selectReglas = `
  SELECT r.id, r.nombre, r.descripcion, r.enabled,
    jsonb_build_object('id', d.id, 'nombre', d.nombre, 'type', d.tipo) AS disparador,
    r.condicion, r.acciones
  FROM reglas r JOIN disparadores d ON d.id = r.disparador_id
`

function validarRegla(req, res, next) {
  const r = req.body
  if (!r || !texto(r.nombre) || typeof r.descripcion !== 'string' ||
      typeof r.enabled !== 'boolean' || !texto(r.disparador?.type) ||
      !['all', 'any'].includes(r.condicion?.declaracion) ||
      !Array.isArray(r.condicion?.condiciones) || !r.condicion.condiciones.length ||
      !Array.isArray(r.acciones) || !r.acciones.length) {
    return res.status(400).json({ message: 'La regla requiere nombre, descripción, estado, disparador, condiciones y acciones.' })
  }
  const condicionesValidas = r.condicion.condiciones.every(c =>
    texto(c?.campo) && texto(c?.operador) && texto(c?.keyword))
  const accionesValidas = r.acciones.every(a => {
    switch (a?.tipo) {
      case 'email': return texto(a.destinatario) && texto(a.asunto) && texto(a.cuerpo)
      case 'sms': return texto(a.telefono) && texto(a.mensaje)
      case 'webhook':
        try {
          return texto(a.url) && ['http:', 'https:'].includes(new URL(a.url).protocol) &&
            ['POST', 'PUT'].includes(a.metodo)
        } catch { return false }
      default: return false
    }
  })
  if (!condicionesValidas || !accionesValidas) {
    return res.status(400).json({ message: 'Hay condiciones o acciones incompletas.' })
  }
  if (r.id !== undefined && (!uuid.test(r.id) || (req.params.id && r.id !== req.params.id))) {
    return res.status(400).json({ message: 'El ID del cuerpo es inválido o no coincide con la URL.' })
  }
  next()
}

export function createApp(pool) {
  const app = express()
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200' }))
  app.use(express.json())
  app.param('id', (req, res, next, id) => {
    if (!uuid.test(id)) return res.status(400).json({ message: 'ID inválido.' })
    next()
  })

  app.get('/api/reglas', async (req, res) => {
    const { rows } = await pool.query(`${selectReglas} ORDER BY r.nombre, r.id`)
    res.json(rows)
  })

  // POST y PUT reciben GuardarReglaRequest; el ID de creación lo genera la BD.
  async function guardar(req, res) {
    const r = req.body
    const disparador = await pool.query('SELECT id FROM disparadores WHERE tipo = $1', [r.disparador.type])
    if (!disparador.rows.length) return res.status(400).json({ message: 'El disparador no existe.' })
    const valores = [r.nombre.trim(), r.descripcion.trim(), r.enabled,
      disparador.rows[0].id, JSON.stringify(r.condicion), JSON.stringify(r.acciones)]
    const editar = req.method === 'PUT'
    const resultado = editar
      ? await pool.query(`UPDATE reglas SET nombre=$1, descripcion=$2, enabled=$3,
          disparador_id=$4, condicion=$5::jsonb, acciones=$6::jsonb WHERE id=$7 RETURNING id`,
        [...valores, req.params.id])
      : await pool.query(`INSERT INTO reglas (nombre, descripcion, enabled, disparador_id, condicion, acciones)
          VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb) RETURNING id`, valores)
    if (!resultado.rows.length) return res.status(404).json({ message: 'La regla no existe.' })
    const { rows } = await pool.query(`${selectReglas} WHERE r.id=$1`, [resultado.rows[0].id])
    if (!rows.length) return res.status(404).json({ message: 'La regla ya no existe.' })
    res.status(editar ? 200 : 201).json(rows[0])
  }
  app.post('/api/reglas', validarRegla, guardar)
  app.put('/api/reglas/:id', validarRegla, guardar)
  app.delete('/api/reglas/:id', async (req, res) => {
    const { rowCount } = await pool.query('DELETE FROM reglas WHERE id=$1', [req.params.id])
    if (!rowCount) return res.status(404).json({ message: 'La regla no existe.' })
    res.status(204).end()
  })
  app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada.' }))
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'JSON inválido.' })
    if (error.type === 'entity.too.large') return res.status(413).json({ message: 'El cuerpo de la petición es demasiado grande.' })
    console.error(error)
    res.status(500).json({ message: 'No se pudo completar la operación.' })
  })
  return app
}
