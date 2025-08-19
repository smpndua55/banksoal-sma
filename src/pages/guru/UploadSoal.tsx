import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Upload, FileText } from 'lucide-react';

interface SelectOption {
  id: string;
  nama: string;
}

const UploadSoal = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tahunAjaran, setTahunAjaran] = useState<SelectOption[]>([]);
  const [mapel, setMapel] = useState<SelectOption[]>([]);
  const [kelas, setKelas] = useState<SelectOption[]>([]);
  const [jenisUjian, setJenisUjian] = useState<SelectOption[]>([]);
  const [formData, setFormData] = useState({
    tahun_ajaran_id: '',
    mapel_id: '',
    kelas_ids: [] as string[],
    jenis_ujian_id: '',
    semester: '',
    file: null as File | null
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchSelectOptions();
  }, []);

  const fetchSelectOptions = async () => {
    setLoading(true);
    try {
      const [tahunAjaranResult, mapelResult, kelasResult, jenisUjianResult] = await Promise.all([
        supabase.from('tahun_ajaran').select('id, nama').order('nama'),
        supabase.from('mapel').select('id, nama').order('nama'),
        supabase.from('kelas').select('id, nama').order('nama'),
        supabase.from('jenis_ujian').select('id, nama').order('nama')
      ]);

      if (tahunAjaranResult.data) setTahunAjaran(tahunAjaranResult.data);
      if (mapelResult.data) setMapel(mapelResult.data);
      if (kelasResult.data) setKelas(kelasResult.data);
      if (jenisUjianResult.data) setJenisUjian(jenisUjianResult.data);
    } catch (error) {
      console.error('Error fetching options:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data pilihan",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Format file tidak didukung. Gunakan PDF, DOC, DOCX, JPG, JPEG, atau PNG",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ukuran file terlalu besar. Maksimal 10MB",
        });
        return;
      }

      setFormData({ ...formData, file });
    }
  };

  const handleKelasChange = (kelasId: string, checked: boolean) => {
    if (checked) {
      setFormData({ 
        ...formData, 
        kelas_ids: [...formData.kelas_ids, kelasId] 
      });
    } else {
      setFormData({ 
        ...formData, 
        kelas_ids: formData.kelas_ids.filter(id => id !== kelasId) 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file || !user || formData.kelas_ids.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pilih file dan minimal satu kelas yang akan diupload",
      });
      return;
    }

    setUploading(true);
    
    try {
      // Get related data for filename generation
      const [tahunAjaranData, mapelData] = await Promise.all([
        supabase.from('tahun_ajaran').select('nama').eq('id', formData.tahun_ajaran_id).single(),
        supabase.from('mapel').select('nama').eq('id', formData.mapel_id).single()
      ]);

      // Get kelas names
      const { data: kelasData } = await supabase
        .from('kelas')
        .select('nama')
        .in('id', formData.kelas_ids);

      // Generate filename: mata_pelajaran_kelas_tahun_ajaran_semester
      const fileExt = formData.file.name.split('.').pop();
      const kelasNames = kelasData?.map(k => k.nama).join('-') || 'unknown';
      const fileName = `${mapelData.data?.nama || 'unknown'}_${kelasNames}_${tahunAjaranData.data?.nama || 'unknown'}_${formData.semester}.${fileExt}`;
      const uniqueFileName = `${Date.now()}-${fileName}`;
      const filePath = `soal/${user.id}/${uniqueFileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('soal-files')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('soal-files')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('soal_uploads')
        .insert([{
          guru_id: user.id,
          tahun_ajaran_id: formData.tahun_ajaran_id,
          mapel_id: formData.mapel_id,
          kelas_ids: formData.kelas_ids,
          jenis_ujian_id: formData.jenis_ujian_id,
          semester: formData.semester,
          file_name: uniqueFileName,
          file_url: publicUrl,
          file_size: formData.file.size
        }]);

      if (dbError) throw dbError;

      toast({
        title: "Berhasil",
        description: "Soal berhasil diupload",
      });

      // Reset form
      setFormData({
        tahun_ajaran_id: '',
        mapel_id: '',
        kelas_ids: [],
        jenis_ujian_id: '',
        semester: '',
        file: null
      });

      // Reset file input
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengupload soal",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1">
        <header className="h-14 flex items-center border-b bg-background px-4">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-lg font-semibold">Upload Soal</h1>
          </div>
        </header>

        <div className="p-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Soal Ujian
              </CardTitle>
              <CardDescription>
                Upload file soal ujian dengan informasi yang lengkap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tahun_ajaran_id">Tahun Ajaran</Label>
                    <Select
                      value={formData.tahun_ajaran_id}
                      onValueChange={(value) => setFormData({ ...formData, tahun_ajaran_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tahun ajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {tahunAjaran.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="mapel_id">Mata Pelajaran</Label>
                    <Select
                      value={formData.mapel_id}
                      onValueChange={(value) => setFormData({ ...formData, mapel_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih mata pelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {mapel.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Kelas (Pilih minimal 1)</Label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
                      {kelas.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`kelas-${item.id}`}
                            checked={formData.kelas_ids.includes(item.id)}
                            onCheckedChange={(checked) => handleKelasChange(item.id, !!checked)}
                          />
                          <Label 
                            htmlFor={`kelas-${item.id}`} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            {item.nama}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.kelas_ids.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.kelas_ids.length} kelas dipilih
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="jenis_ujian_id">Jenis Ujian</Label>
                    <Select
                      value={formData.jenis_ujian_id}
                      onValueChange={(value) => setFormData({ ...formData, jenis_ujian_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis ujian" />
                      </SelectTrigger>
                      <SelectContent>
                        {jenisUjian.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => setFormData({ ...formData, semester: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ganjil">Ganjil</SelectItem>
                        <SelectItem value="genap">Genap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="file">File Soal</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Format yang didukung: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB)
                  </p>
                  {formData.file && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{formData.file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Soal
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UploadSoal;