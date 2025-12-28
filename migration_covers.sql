-- Phase 7B: Digital Covers System Migration

-- 1. Add cover columns to evento_anfitrion table
ALTER TABLE evento_anfitrion 
ADD COLUMN IF NOT EXISTS cupo_covers integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS covers_usados integer DEFAULT 0;

-- 2. Create covers_canjeados table for tracking individual cover QR codes
CREATE TABLE IF NOT EXISTS covers_canjeados (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  evento_anfitrion_id uuid REFERENCES evento_anfitrion(id) ON DELETE CASCADE,
  codigo_qr text UNIQUE NOT NULL, -- Unique QR code (UUID)
  usado boolean DEFAULT false,
  fecha_uso timestamptz,
  validado_por text, -- Email/identifier of who scanned it
  CONSTRAINT covers_canjeados_evento_fkey FOREIGN KEY (evento_anfitrion_id) REFERENCES evento_anfitrion(id)
);

-- 3. Enable RLS for covers table
ALTER TABLE covers_canjeados ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow all (simplify for MVP, can restrict later)
CREATE POLICY "Permitir todo temporalmente" ON covers_canjeados FOR ALL USING (true);

-- 5. Create index for faster QR lookups
CREATE INDEX IF NOT EXISTS idx_covers_codigo_qr ON covers_canjeados(codigo_qr);
CREATE INDEX IF NOT EXISTS idx_covers_evento_anfitrion ON covers_canjeados(evento_anfitrion_id);

-- 6. Function to increment cover usage atomically
CREATE OR REPLACE FUNCTION increment_covers_usados(row_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE evento_anfitrion
  SET covers_usados = covers_usados + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
