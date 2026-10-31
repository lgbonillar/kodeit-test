BEGIN;

CREATE TEMP TABLE mock_reglas AS
SELECT value AS datos
FROM jsonb_array_elements(
    pg_read_file('/seed/mock.json')::jsonb
);

INSERT INTO disparadores (id, nombre, tipo)
SELECT DISTINCT
    (datos->'disparador'->>'id')::uuid,
    datos->'disparador'->>'nombre',
    datos->'disparador'->>'type'
FROM mock_reglas;

INSERT INTO reglas (
    id,
    nombre,
    descripcion,
    enabled,
    disparador_id,
    condicion,
    acciones
)
SELECT
    (datos->>'id')::uuid,
    datos->>'nombre',
    datos->>'descripcion',
    (datos->>'enabled')::boolean,
    (datos->'disparador'->>'id')::uuid,
    datos->'condicion',
    datos->'acciones'
FROM mock_reglas;

DROP TABLE mock_reglas;

COMMIT;
