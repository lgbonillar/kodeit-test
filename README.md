# Reglas de notificación

Prueba técnica desarrollada con Angular y PrimeNG para configurar reglas con disparadores, condiciones y acciones.

> **Nota:** Backend y base de datos generados con IA.

## Requisitos

- Node.js y npm instalados, compatibles con Angular 22.
- Docker con Docker Compose disponible y el motor iniciado.

## Ejecutar el proyecto

Para desarrollo, PostgreSQL y el backend se ejecutan en Docker; Angular se ejecuta localmente con su servidor de desarrollo.

Desde la raíz del proyecto, levanta el backend y PostgreSQL:

```bash
docker compose up -d
```

Compose construye la imagen del backend si todavía no existe y espera a que PostgreSQL esté disponible antes de iniciar la API. No necesitas instalar las dependencias del backend en tu PC.

- Frontend: [http://localhost:4200](http://localhost:4200), después de ejecutar `npm start`.
- Backend: [http://localhost:3000/api/reglas](http://localhost:3000/api/reglas).
- PostgreSQL: `localhost:5432`, base `reglas`, usuario `reglas`, contraseña `reglas_dev` (credenciales de prueba).

Instala las dependencias del frontend la primera vez:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm start
```

Abre [http://localhost:4200](http://localhost:4200) en el navegador.

Para detener el servidor, presiona `Ctrl + C` en la terminal.

Para detener y retirar los contenedores:

```bash
docker compose down
```

Después de modificar el código o las dependencias del backend, reconstruye su imagen:

```bash
docker compose up -d --build backend
```

Para revisar sus logs:

```bash
docker compose logs -f backend
```

## Datos de prueba

PostgreSQL crea las tablas con `database/init/01-schema.sql` y carga las 15 reglas y los 3 disparadores de `public/mock.json` mediante `database/init/02-seed.sql`.

La base utiliza `tmpfs`: al detener el contenedor de PostgreSQL se pierden los cambios. En el siguiente arranque vuelve a cargar los datos del mock. Ejecutar `docker compose up -d` mientras los contenedores ya están funcionando no reinicia la base.

El frontend consulta la API para listar, crear, editar, eliminar y habilitar o deshabilitar reglas. La URL base se configura en `src/environments/environment.ts` (producción) y `src/environments/environment.development.ts` (desarrollo); ambos apuntan a `http://localhost:3000/api` para esta prueba local. El mock se utiliza para inicializar PostgreSQL.

## API

Backend mínimo con Express 5 y PostgreSQL, disponible en `http://localhost:3000`.

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/api/reglas` | 200, arreglo de reglas |
| POST | `/api/reglas` | 201, regla creada |
| PUT | `/api/reglas/:id` | 200, regla reemplazada |
| DELETE | `/api/reglas/:id` | 204, sin cuerpo |

POST y PUT reciben `GuardarReglaRequest` completo y devuelven `Rule`, con el disparador completo. POST genera un UUID nuevo; PUT utiliza el ID de la URL y verifica que coincida con el del cuerpo si se envía.

Datos inválidos producen 400 y una regla inexistente produce 404. Los errores devuelven `{ "message": "..." }`. La validación comprueba estructura, campos obligatorios y URL/método del webhook. El backend almacena las acciones; no ejecuta envíos de email, SMS ni llamadas a webhooks.

El Compose configura el puerto 3000 y permite el origen `http://localhost:4200` mediante CORS. Si cambias el puerto del backend, ajusta tanto `PORT` como el mapeo de `ports` en `docker-compose.yaml`.

Para probar el CRUD contra la API levantada (crea y elimina una regla temporal):

```bash
node backend/scripts/smoke-test.js
```
