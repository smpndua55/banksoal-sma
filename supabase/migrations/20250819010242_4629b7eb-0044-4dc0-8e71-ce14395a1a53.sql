-- Add semester field to soal_uploads table
ALTER TABLE public.soal_uploads 
ADD COLUMN semester text NOT NULL DEFAULT 'ganjil' CHECK (semester IN ('ganjil', 'genap'));