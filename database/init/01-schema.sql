CREATE TABLE disparadores (
    id UUID PRIMARY KEY,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL UNIQUE
);

CREATE TABLE reglas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL DEFAULT '',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    disparador_id UUID NOT NULL
        REFERENCES disparadores(id),

    condicion JSONB NOT NULL,
    acciones JSONB NOT NULL,

    CHECK (jsonb_typeof(condicion) = 'object'),
    CHECK (
        condicion->>'declaracion' IS NOT NULL
        AND condicion->>'declaracion' IN ('all', 'any')
    ),
    CHECK (
        condicion->'condiciones' IS NOT NULL
        AND jsonb_typeof(condicion->'condiciones') = 'array'
    ),
    CHECK (jsonb_typeof(acciones) = 'array')
);
