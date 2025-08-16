-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'guru');

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'guru',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tahun_ajaran table
CREATE TABLE public.tahun_ajaran (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mapel table
CREATE TABLE public.mapel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kelas table
CREATE TABLE public.kelas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jenis_ujian table
CREATE TABLE public.jenis_ujian (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pengumuman table
CREATE TABLE public.pengumuman (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create soal_uploads table
CREATE TABLE public.soal_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guru_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  tahun_ajaran_id UUID NOT NULL REFERENCES public.tahun_ajaran(id) ON DELETE RESTRICT,
  mapel_id UUID NOT NULL REFERENCES public.mapel(id) ON DELETE RESTRICT,
  kelas_id UUID NOT NULL REFERENCES public.kelas(id) ON DELETE RESTRICT,
  jenis_ujian_id UUID NOT NULL REFERENCES public.jenis_ujian(id) ON DELETE RESTRICT,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tahun_ajaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jenis_ujian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soal_uploads ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.profiles
  WHERE user_id = _user_id
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for master data (admin only for CUD, all authenticated for read)
CREATE POLICY "Everyone can view tahun_ajaran" ON public.tahun_ajaran
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage tahun_ajaran" ON public.tahun_ajaran
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view mapel" ON public.mapel
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage mapel" ON public.mapel
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view kelas" ON public.kelas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage kelas" ON public.kelas
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view jenis_ujian" ON public.jenis_ujian
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage jenis_ujian" ON public.jenis_ujian
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pengumuman
CREATE POLICY "Everyone can view active pengumuman" ON public.pengumuman
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Admins can manage pengumuman" ON public.pengumuman
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for soal_uploads
CREATE POLICY "Users can view their own uploads" ON public.soal_uploads
  FOR SELECT USING (guru_id = auth.uid());

CREATE POLICY "Admins can view all uploads" ON public.soal_uploads
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Guru can create their own uploads" ON public.soal_uploads
  FOR INSERT WITH CHECK (guru_id = auth.uid() AND public.has_role(auth.uid(), 'guru'));

CREATE POLICY "Users can update their own uploads" ON public.soal_uploads
  FOR UPDATE USING (guru_id = auth.uid());

CREATE POLICY "Users can delete their own uploads" ON public.soal_uploads
  FOR DELETE USING (guru_id = auth.uid());

CREATE POLICY "Admins can manage all uploads" ON public.soal_uploads
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for soal files
INSERT INTO storage.buckets (id, name, public) VALUES ('soal-files', 'soal-files', false);

-- Storage policies for soal files
CREATE POLICY "Authenticated users can view soal files" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'soal-files');

CREATE POLICY "Guru can upload soal files" ON storage.objects
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'soal-files' AND public.has_role(auth.uid(), 'guru'));

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE TO authenticated 
  USING (bucket_id = 'soal-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE TO authenticated 
  USING (bucket_id = 'soal-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage all soal files" ON storage.objects
  FOR ALL TO authenticated 
  USING (bucket_id = 'soal-files' AND public.has_role(auth.uid(), 'admin'));

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nama, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nama', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'username', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'guru')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pengumuman_updated_at
  BEFORE UPDATE ON public.pengumuman
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user data
INSERT INTO public.tahun_ajaran (nama, is_active) VALUES ('2024/2025', true);
INSERT INTO public.mapel (nama) VALUES ('Matematika'), ('Bahasa Indonesia'), ('Bahasa Inggris'), ('IPA'), ('IPS');
INSERT INTO public.kelas (nama) VALUES ('VII'), ('VIII'), ('IX'), ('X'), ('XI'), ('XII');
INSERT INTO public.jenis_ujian (nama) VALUES ('Ulangan Harian'), ('UTS'), ('UAS'), ('Ujian Praktik');