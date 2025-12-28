-- 1. Actualizar tabla 'eventos'
ALTER TABLE eventos 
ADD COLUMN IF NOT EXISTS estado text DEFAULT 'borrador', 
ADD COLUMN IF NOT EXISTS imagen_url text;

-- 2. Actualizar tabla 'evento_anfitrion' (CRÍTICO para que funcione la app)
ALTER TABLE evento_anfitrion 
ADD COLUMN IF NOT EXISTS access_token uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS estado text DEFAULT 'pendiente', -- pendiente, confirmado, rechazado
ADD COLUMN IF NOT EXISTS cupo_invitados integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS invitados_registrados integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;

-- 3. Crear tabla 'invitados_anfitrion' (Si no existe)
CREATE TABLE IF NOT EXISTS invitados_anfitrion (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  evento_anfitrion_id uuid REFERENCES evento_anfitrion(id) ON DELETE CASCADE,
  nombre_completo text NOT NULL,
  rut_dni text,
  estado text DEFAULT 'en_lista' -- en_lista, ingresado
);

-- 4. Habilitar RLS (Seguridad básica)
ALTER TABLE invitados_anfitrion ENABLE ROW LEVEL SECURITY;

-- Política simple: Permitir todo por ahora (puedes restringir luego)
CREATE POLICY "Permitir todo temporalmente" ON invitados_anfitrion FOR ALL USING (true);
CREATE POLICY "Permitir todo temporalmente" ON evento_anfitrion FOR ALL USING (true);
CREATE POLICY "Permitir todo temporalmente" ON anfitriones FOR ALL USING (true);
CREATE POLICY "Permitir todo temporalmente" ON eventos FOR ALL USING (true);

-- 5. Función RPC para incrementar contador atómicamente
CREATE OR REPLACE FUNCTION increment_guests(row_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE evento_anfitrion
  SET invitados_registrados = invitados_registrados + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Políticas de Storage (Evidence Bucket)
-- Asegura que el bucket exista y sea público
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Permiso total (Subir, Ver, Borrar) para el bucket 'evidence' para todos (público)
CREATE POLICY "Permiso total evidence"
ON storage.objects FOR ALL
USING ( bucket_id = 'evidence' )
USING ( bucket_id = 'evidence' )
WITH CHECK ( bucket_id = 'evidence' );

-- 7. (Phase 5) Host Application Columns
-- Agrega columnas para el perfil de postulante
ALTER TABLE anfitriones 
ADD COLUMN IF NOT EXISTS instagram_handle text,
ADD COLUMN IF NOT EXISTS evidencia_seguidores_url text, -- Screenshot del perfil
ADD COLUMN IF NOT EXISTS estado_cuenta text DEFAULT 'aprobado'; -- 'pendiente', 'rechazado', 'aprobado'

-- Asegurar que los actuales queden aprobados
UPDATE anfitriones SET estado_cuenta = 'aprobado' WHERE estado_cuenta IS NULL;
