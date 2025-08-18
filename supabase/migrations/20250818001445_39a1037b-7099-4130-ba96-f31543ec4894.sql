-- Update soal_uploads table to support multiple classes
ALTER TABLE soal_uploads 
DROP COLUMN kelas_id;

ALTER TABLE soal_uploads 
ADD COLUMN kelas_ids uuid[] NOT NULL DEFAULT '{}';

-- Add index for better performance on array queries
CREATE INDEX idx_soal_uploads_kelas_ids ON soal_uploads USING GIN(kelas_ids);