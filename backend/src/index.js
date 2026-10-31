import pg from 'pg'
import { createApp } from './app.js'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://reglas:reglas_dev@localhost:5432/reglas',
})
pool.on('error', error => console.error('Error de conexión PostgreSQL:', error))
await pool.query('SELECT 1')
const port = Number(process.env.PORT ?? 3000)
const server = createApp(pool).listen(port, '0.0.0.0', () => {
  console.log(`API disponible en http://localhost:${port}/api/reglas`)
})
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(async () => {
    await pool.end()
    process.exit(0)
  }))
}
