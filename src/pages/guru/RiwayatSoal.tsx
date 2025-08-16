import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Download, Trash2, Eye } from 'lucide-react';

interface SoalUpload {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  tahun_ajaran: { nama: string };
  mapel: { nama: string };
  kelas: { nama: string };
  jenis_ujian: { nama: string };
}

const RiwayatSoal = () => {
  const [soalUploads, setSoalUploads] = useState<SoalUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSoalUploads();
    }
  }, [user]);

  const fetchSoalUploads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('soal_uploads')
        .select(`
          *,
          tahun_ajaran:tahun_ajaran_id(nama),
          mapel:mapel_id(nama),
          kelas:kelas_id(nama),
          jenis_ujian:jenis_ujian_id(nama)
        `)
        .eq('guru_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setSoalUploads(data || []);
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

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengunduh file",
      });
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Mata Pelajaran</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Jenis Ujian</TableHead>
                      <TableHead>Tahun Ajaran</TableHead>
                      <TableHead>Tanggal Upload</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {soalUploads.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.file_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatFileSize(item.file_size || 0)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.mapel?.nama}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.kelas?.nama}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.jenis_ujian?.nama}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.tahun_ajaran?.nama}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(item.uploaded_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(item.file_url, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(item.file_url, item.file_name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id, item.file_url)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RiwayatSoal;