import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Download, Trash2, Eye, Edit } from 'lucide-react';

interface SoalUpload {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  tahun_ajaran_id: string;
  mapel_id: string;
  kelas_ids: string[];
  kelas_names?: string[];
  jenis_ujian_id: string;
  semester: string;
  tahun_ajaran: { nama: string };
  mapel: { nama: string };
  jenis_ujian: { nama: string };
}

interface SelectOption {
  id: string;
  nama: string;
}

const RiwayatSoal = () => {
  const [soalUploads, setSoalUploads] = useState<SoalUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSoal, setEditingSoal] = useState<SoalUpload | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [tahunAjaran, setTahunAjaran] = useState<SelectOption[]>([]);
  const [mapel, setMapel] = useState<SelectOption[]>([]);
  const [kelas, setKelas] = useState<SelectOption[]>([]);
  const [jenisUjian, setJenisUjian] = useState<SelectOption[]>([]);
  
  const [editFormData, setEditFormData] = useState({
    tahun_ajaran_id: '',
    mapel_id: '',
    kelas_ids: [] as string[],
    jenis_ujian_id: '',
    semester: '',
    file: null as File | null,
    replaceFile: false
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSelectOptions();
      fetchSoalUploads();
    }
  }, [user]);

  const fetchSelectOptions = async () => {
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
    }
  };

  const fetchSoalUploads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('soal_uploads')
        .select(`
          *,
          tahun_ajaran:tahun_ajaran_id(nama),
          mapel:mapel_id(nama),
          jenis_ujian:jenis_ujian_id(nama)
        `)
        .eq('guru_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      // Fetch kelas names for display
      const dataWithKelasNames = await Promise.all(
        (data || []).map(async (item) => {
          if (item.kelas_ids && item.kelas_ids.length > 0) {
            const { data: kelasData } = await supabase
              .from('kelas')
              .select('nama')
              .in('id', item.kelas_ids);
            return {
              ...item,
              kelas_names: kelasData?.map(k => k.nama) || []
            };
          }
          return { ...item, kelas_names: [] };
        })
      );

      setSoalUploads(dataWithKelasNames);
    } catch (error) {
      console.error('Error fetching soal uploads:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil riwayat upload soal",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (soal: SoalUpload) => {
    setEditingSoal(soal);
      setEditFormData({
        tahun_ajaran_id: soal.tahun_ajaran_id,
        mapel_id: soal.mapel_id,
        kelas_ids: soal.kelas_ids,
        jenis_ujian_id: soal.jenis_ujian_id,
        semester: soal.semester || 'ganjil',
        file: null,
        replaceFile: false
      });
    setIsEditDialogOpen(true);
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

      setEditFormData({ ...editFormData, file, replaceFile: true });
    }
  };

  const handleEditKelasChange = (kelasId: string, checked: boolean) => {
    if (checked) {
      setEditFormData({ 
        ...editFormData, 
        kelas_ids: [...editFormData.kelas_ids, kelasId] 
      });
    } else {
      setEditFormData({ 
        ...editFormData, 
        kelas_ids: editFormData.kelas_ids.filter(id => id !== kelasId) 
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSoal || !user) return;

    setUploading(true);
    
    try {
      let fileUrl = editingSoal.file_url;
      let fileName = editingSoal.file_name;
      let fileSize = editingSoal.file_size;

      // If replacing file, upload new file
      if (editFormData.replaceFile && editFormData.file) {
        // Delete old file
        const oldUrlParts = editingSoal.file_url.split('/');
        const oldFilePath = oldUrlParts.slice(-3).join('/');
        
        await supabase.storage
          .from('soal-files')
          .remove([oldFilePath]);

        // Upload new file
        const fileExt = editFormData.file.name.split('.').pop();
        const newFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const newFilePath = `soal/${user.id}/${newFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('soal-files')
          .upload(newFilePath, editFormData.file);

        if (uploadError) throw uploadError;

        // Get new public URL
        const { data: { publicUrl } } = supabase.storage
          .from('soal-files')
          .getPublicUrl(newFilePath);

        fileUrl = publicUrl;
        fileName = editFormData.file.name;
        fileSize = editFormData.file.size;
      }

      // Update database
      const { error: dbError } = await supabase
        .from('soal_uploads')
        .update({
          tahun_ajaran_id: editFormData.tahun_ajaran_id,
          mapel_id: editFormData.mapel_id,
          kelas_ids: editFormData.kelas_ids,
          jenis_ujian_id: editFormData.jenis_ujian_id,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize
        })
        .eq('id', editingSoal.id);

      if (dbError) throw dbError;

      toast({
        title: "Berhasil",
        description: "Soal berhasil diperbarui",
      });

      setIsEditDialogOpen(false);
      setEditingSoal(null);
      fetchSoalUploads();

    } catch (error: any) {
      console.error('Error updating soal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal memperbarui soal",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      console.log('Download started for:', fileName);
      console.log('File URL:', fileUrl);
      
      // Extract file path from URL for Supabase storage
      const urlParts = fileUrl.split('/');
      console.log('URL parts:', urlParts);
      const filePath = urlParts.slice(-3).join('/'); // Get soal/user_id/filename
      console.log('Extracted file path:', filePath);
      
      // Use Supabase storage to download the file properly
      const { data, error } = await supabase.storage
        .from('soal-files')
        .download(filePath);

      console.log('Storage download result:', { data, error });

      if (error) {
        console.error('Storage download error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No file data received');
      }

      console.log('File data received, size:', data.size);

      // Create blob URL and download
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('Download completed successfully');
      toast({
        title: "Berhasil",
        description: "File berhasil didownload",
      });
    } catch (error: any) {
      console.error('Error downloading file:', error);
      console.error('Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error
      });
      
      // Fallback to direct URL download if storage download fails
      try {
        console.log('Attempting fallback download method...');
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('Fallback download completed successfully');
        toast({
          title: "Berhasil",
          description: "File berhasil didownload",
        });
      } catch (fallbackError: any) {
        console.error('Fallback download also failed:', fallbackError);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Gagal mengunduh file",
        });
      }
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) return;

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/');
      const filePath = urlParts.slice(-3).join('/'); // Get last 3 parts (soal/user_id/filename)

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('soal-files')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('soal_uploads')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: "Berhasil",
        description: "Soal berhasil dihapus",
      });
      fetchSoalUploads();
    } catch (error: any) {
      console.error('Error deleting soal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus soal",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <h1 className="text-lg font-semibold">Riwayat Soal</h1>
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Riwayat Upload Soal
              </CardTitle>
              <CardDescription>
                Daftar soal yang telah Anda upload ke sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              {soalUploads.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Belum ada soal yang diupload
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Mobile View - Cards */}
                    <div className="block md:hidden space-y-4">
                      {soalUploads.map((item) => (
                        <Card key={item.id} className="p-4">
                          <div className="space-y-3">
                            <div>
                              <div className="font-medium text-sm">{item.file_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatFileSize(item.file_size || 0)}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Mapel:</span>
                                <Badge variant="outline" className="ml-1 text-xs">
                                  {item.mapel?.nama}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Ujian:</span>
                                <Badge variant="outline" className="ml-1 text-xs">
                                  {item.jenis_ujian?.nama}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Semester:</span>
                                <Badge variant="outline" className="ml-1 text-xs capitalize">
                                  {item.semester}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Tahun:</span>
                                <Badge variant="outline" className="ml-1 text-xs">
                                  {item.tahun_ajaran?.nama}
                                </Badge>
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground text-xs">Kelas:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.kelas_names?.map((namaKelas, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {namaKelas}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              {new Date(item.uploaded_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(item.file_url, '_blank')}
                                className="flex-1"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Lihat
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(item.file_url, item.file_name)}
                                className="flex-1"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                                className="flex-1"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(item.id, item.file_url)}
                                className="flex-1"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Hapus
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop View - Table */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">File</TableHead>
                            <TableHead className="min-w-[120px]">Mata Pelajaran</TableHead>
                            <TableHead className="min-w-[100px]">Kelas</TableHead>
                            <TableHead className="min-w-[120px]">Jenis Ujian</TableHead>
                            <TableHead className="min-w-[80px]">Semester</TableHead>
                            <TableHead className="min-w-[120px]">Tahun Ajaran</TableHead>
                            <TableHead className="min-w-[150px]">Tanggal Upload</TableHead>
                            <TableHead className="min-w-[200px]">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {soalUploads.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium break-words max-w-[180px]">{item.file_name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatFileSize(item.file_size || 0)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="break-words">
                                  {item.mapel?.nama}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1 max-w-[120px]">
                                  {item.kelas_names?.map((namaKelas, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {namaKelas}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="break-words">
                                  {item.jenis_ujian?.nama}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {item.semester}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="break-words">
                                  {item.tahun_ajaran?.nama}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {new Date(item.uploaded_at).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 flex-wrap">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(item.file_url, '_blank')}
                                    title="Lihat"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(item.file_url, item.file_name)}
                                    title="Download"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(item.id, item.file_url)}
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Soal</DialogTitle>
              <DialogDescription>
                Perbarui informasi soal dan/atau ganti file
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_tahun_ajaran_id">Tahun Ajaran</Label>
                  <Select
                    value={editFormData.tahun_ajaran_id}
                    onValueChange={(value) => setEditFormData({ ...editFormData, tahun_ajaran_id: value })}
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
                  <Label htmlFor="edit_mapel_id">Mata Pelajaran</Label>
                  <Select
                    value={editFormData.mapel_id}
                    onValueChange={(value) => setEditFormData({ ...editFormData, mapel_id: value })}
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
                          id={`edit-kelas-${item.id}`}
                          checked={editFormData.kelas_ids.includes(item.id)}
                          onCheckedChange={(checked) => handleEditKelasChange(item.id, !!checked)}
                        />
                        <Label 
                          htmlFor={`edit-kelas-${item.id}`} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {item.nama}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {editFormData.kelas_ids.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {editFormData.kelas_ids.length} kelas dipilih
                    </p>
                  )}
                </div>

                 <div>
                   <Label htmlFor="edit_jenis_ujian_id">Jenis Ujian</Label>
                   <Select
                     value={editFormData.jenis_ujian_id}
                     onValueChange={(value) => setEditFormData({ ...editFormData, jenis_ujian_id: value })}
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
                   <Label htmlFor="edit_semester">Semester</Label>
                   <Select
                     value={editFormData.semester}
                     onValueChange={(value) => setEditFormData({ ...editFormData, semester: value })}
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
                <Label htmlFor="edit_file">Ganti File (Opsional)</Label>
                <Input
                  id="edit_file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Kosongkan jika tidak ingin mengganti file. Format: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB)
                </p>
                {editFormData.file && (
                  <div className="mt-2 p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{editFormData.file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(editFormData.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Memperbarui...
                    </>
                  ) : (
                    'Perbarui Soal'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default RiwayatSoal;