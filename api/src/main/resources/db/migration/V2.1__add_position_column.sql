ALTER TABLE form_field
    ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

ALTER TABLE form_field
    ALTER COLUMN position SET NOT NULL,
    ALTER COLUMN position SET DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_form_field_position ON form_field(position);
