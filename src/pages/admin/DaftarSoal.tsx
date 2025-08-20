import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Search, Download, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface SoalUpload {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  guru: { nama: string };
  tahun_ajaran: { nama: string };
  mapel: { nama: string };
  kelas_ids: string[];
  kelas_names?: string[];
  jenis_ujian: { nama: string };
  semester: string;
}

interface FilterOptions {
  tahunAjaran: Array<{ id: string; nama: string }>;
  mapel: Array<{ id: string; nama: string }>;
  kelas: Array<{ id: string; nama: string }>;
  jenisUjian: Array<{ id: string; nama: string }>;
  guru: Array<{ user_id: string; nama: string }>;
}

const DaftarSoal = () => {
  const [soalUploads, setSoalUploads] = useState<SoalUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    tahun_ajaran_id: 'all',
    mapel_id: 'all',
    kelas_id: 'all',
    jenis_ujian_id: 'all',
    guru_id: 'all'
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    tahunAjaran: [],
    mapel: [],
    kelas: [],
    jenisUjian: [],
    guru: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [downloading, setDownloading] = useState<string | null>(null);
  const itemsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchSoalUploads();
  }, [currentPage, searchTerm, filters]);

  const fetchFilterOptions = async () => {
    try {
      const [tahunAjaranResult, mapelResult, kelasResult, jenisUjianResult, guruResult] = await Promise.all([
        supabase.from('tahun_ajaran').select('id, nama').order('nama'),
        supabase.from('mapel').select('id, nama').order('nama'),
        supabase.from('kelas').select('id, nama').order('nama'),
        supabase.from('jenis_ujian').select('id, nama').order('nama'),
        supabase.from('profiles').select('user_id, nama').eq('role', 'guru').order('nama')
      ]);

      setFilterOptions({
        tahunAjaran: tahunAjaranResult.data || [],
        mapel: mapelResult.data || [],
        kelas: kelasResult.data || [],
        jenisUjian: jenisUjianResult.data || [],
        guru: guruResult.data || []
      });
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchSoalUploads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('soal_uploads')
        .select(`
          *,
          guru:profiles(nama),
          tahun_ajaran(nama),
          mapel(nama),
          jenis_ujian(nama)
        `, { count: 'exact' });

      // Apply search filter
      if (searchTerm) {
        query = query.or(`file_name.ilike.%${searchTerm}%`);
      }

      // Apply filters
      if (filters.tahun_ajaran_id && filters.tahun_ajaran_id !== 'all') {
        query = query.eq('tahun_ajaran_id', filters.tahun_ajaran_id);
      }
      if (filters.mapel_id && filters.mapel_id !== 'all') {
        query = query.eq('mapel_id', filters.mapel_id);
      }
      if (filters.kelas_id && filters.kelas_id !== 'all') {
        query = query.contains('kelas_ids', [filters.kelas_id]);
      }
      if (filters.jenis_ujian_id && filters.jenis_ujian_id !== 'all') {
        query = query.eq('jenis_ujian_id', filters.jenis_ujian_id);
      }
      if (filters.guru_id && filters.guru_id !== 'all') {
        query = query.eq('guru_id', filters.guru_id);
      }

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await query
        .range(from, to)
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
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching soal uploads:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data soal",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSoalUploads();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      tahun_ajaran_id: 'all',
      mapel_id: 'all',
      kelas_id: 'all',
      jenis_ujian_id: 'all',
      guru_id: 'all'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getFilePathFromUrl = (fileUrl: string) => {
    try {
      console.log('Original URL:', fileUrl);
      
      // Handle different URL formats
      if (fileUrl.includes('/storage/v1/object/public/')) {
        // Standard Supabase public URL format
        const parts = fileUrl.split('/storage/v1/object/public/');
        if (parts.length > 1) {
          const afterPublic = parts[1];
          // Remove bucket name (first segment) to get file path
          const pathParts = afterPublic.split('/');
          if (pathParts.length > 1) {
            const filePath = pathParts.slice(1).join('/');
            console.log('Extracted file path:', filePath);
            return filePath;
          }
        }
      }
      
      // Fallback: Extract from URL pathname
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/').filter(part => part);
      
      // Find the bucket name and extract path after it
      const bucketIndex = pathParts.findIndex(part => part === 'soal-files');
      if (bucketIndex >= 0 && bucketIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        console.log('Fallback extracted file path:', filePath);
        return filePath;
      }
      
      // Last resort: take last few parts
      const filePath = pathParts.slice(-3).join('/');
      console.log('Last resort file path:', filePath);
      return filePath;
      
    } catch (error) {
      console.error('Error parsing file URL:', error);
      return null;
    }
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    
    // Add to DOM, click, and remove
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  const handleDownload = async (fileUrl: string, fileName: string, id: string) => {
    setDownloading(id);
    
    try {
      console.log('=== DOWNLOAD START ===');
      console.log('File:', fileName);
      console.log('URL:', fileUrl);

      const filePath = getFilePathFromUrl(fileUrl);
      console.log('Parsed file path:', filePath);

      if (!filePath) {
        throw new Error('Could not parse file path from URL');
      }

      // Method 1: Direct Supabase storage download (most reliable)
      console.log('Method 1: Supabase storage download');
      try {
        const { data, error } = await supabase.storage
          .from('soal-files')
          .download(filePath);

        if (error) {
          console.log('Storage download error:', error);
          throw error;
        }

        if (data && data.size > 0) {
          console.log('Download successful, file size:', data.size);
          downloadBlob(data, fileName);
          
          toast({
            title: "Berhasil",
            description: "File berhasil didownload",
          });
          return;
        } else {
          throw new Error('Empty file received');
        }
      } catch (storageError) {
        console.log('Method 1 failed:', storageError);
      }

      // Method 2: Create signed URL and download
      console.log('Method 2: Signed URL download');
      try {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('soal-files')
          .createSignedUrl(filePath, 300); // 5 minutes

        if (signedUrlError) {
          console.log('Signed URL error:', signedUrlError);
          throw signedUrlError;
        }

        if (signedUrlData?.signedUrl) {
          console.log('Signed URL created, fetching...');
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
          
          const response = await fetch(signedUrlData.signedUrl, {
            method: 'GET',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const blob = await response.blob();
          console.log('Signed URL download successful, blob size:', blob.size);
          
          if (blob.size === 0) {
            throw new Error('Empty file downloaded');
          }
          
          downloadBlob(blob, fileName);
          
          toast({
            title: "Berhasil",
            description: "File berhasil didownload",
          });
          return;
        }
      } catch (signedUrlErr) {
        console.log('Method 2 failed:', signedUrlErr);
      }

      // Method 3: Try direct URL access (for public files)
      console.log('Method 3: Direct URL access');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(fileUrl, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log('Direct URL download successful, blob size:', blob.size);
        
        if (blob.size === 0) {
          throw new Error('Empty file downloaded');
        }
        
        downloadBlob(blob, fileName);
        
        toast({
          title: "Berhasil",
          description: "File berhasil didownload",
        });
        return;
        
      } catch (directUrlErr) {
        console.log('Method 3 failed:', directUrlErr);
      }

      // All methods failed
      throw new Error('All download methods failed');
      
    } catch (error: any) {
      console.error('=== DOWNLOAD FAILED ===');
      console.error('Error:', error);
      
      // Final fallback: try to open in new tab
      console.log('Fallback: Opening in new tab');
      try {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Info",
          description: "File dibuka di tab baru. Silakan unduh dari browser.",
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Gagal mengunduh file. Error: ${error.message}. Silakan coba tombol 'Lihat' untuk membuka file.`,
        });
      }
    } finally {
      setDownloading(null);
      console.log('=== DOWNLOAD END ===');
    }
  };

  // Debug function to check file accessibility
  const checkFileAccess = async (fileUrl: string, filePath: string | null) => {
    console.log('=== FILE ACCESS CHECK ===');
    console.log('Original URL:', fileUrl);
    console.log('Parsed Path:', filePath);
    
    if (filePath) {
      // Check if file exists in storage
      try {
        const { data, error } = await supabase.storage
          .from('soal-files')
          .list(filePath.split('/').slice(0, -1).join('/') || '');
        
        console.log('Storage list result:', { data, error });
        
        if (data) {
          const fileName = filePath.split('/').pop();
          const fileExists = data.some(file => file.name === fileName);
          console.log(`File "${fileName}" exists in storage:`, fileExists);
        }
      } catch (listError) {
        console.log('Storage list error:', listError);
      }
    }
    
    // Try to get file info
    try {
      const response = await fetch(fileUrl, { method: 'HEAD' });
      console.log('HEAD request result:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
    } catch (headError) {
      console.log('HEAD request error:', headError);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string, id: string) => {
    setDownloading(id);
    
    try {
      console.log('=== DOWNLOAD START ===');
      console.log('File:', fileName);
      console.log('URL:', fileUrl);

      const filePath = getFilePathFromUrl(fileUrl);
      console.log('Parsed file path:', filePath);

      // Debug file access
      await checkFileAccess(fileUrl, filePath);

      if (!filePath) {
        throw new Error('Could not parse file path from URL');
      }

      // Method 1: Direct Supabase storage download (most reliable)
      console.log('Method 1: Supabase storage download');
      try {
        const { data, error } = await supabase.storage
          .from('soal-files')
          .download(filePath);

        if (error) {
          console.log('Storage download error:', error);
          throw error;
        }

        if (data && data.size > 0) {
          console.log('Download successful, file size:', data.size);
          downloadBlob(data, fileName);
          
          toast({
            title: "Berhasil",
            description: "File berhasil didownload",
          });
          return;
        } else {
          throw new Error('Empty file received');
        }
      } catch (storageError) {
        console.log('Method 1 failed:', storageError);
      }

      // Method 2: Create signed URL and download
      console.log('Method 2: Signed URL download');
      try {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('soal-files')
          .createSignedUrl(filePath, 300); // 5 minutes

        if (signedUrlError) {
          console.log('Signed URL error:', signedUrlError);
          throw signedUrlError;
        }

        if (signedUrlData?.signedUrl) {
          console.log('Signed URL created, fetching...');
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
          
          const response = await fetch(signedUrlData.signedUrl, {
            method: 'GET',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const blob = await response.blob();
          console.log('Signed URL download successful, blob size:', blob.size);
          
          if (blob.size === 0) {
            throw new Error('Empty file downloaded');
          }
          
          downloadBlob(blob, fileName);
          
          toast({
            title: "Berhasil",
            description: "File berhasil didownload",
          });
          return;
        }
      } catch (signedUrlErr) {
        console.log('Method 2 failed:', signedUrlErr);
      }

      // Method 3: Try direct URL access (for public files)
      console.log('Method 3: Direct URL access');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(fileUrl, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log('Direct URL download successful, blob size:', blob.size);
        
        if (blob.size === 0) {
          throw new Error('Empty file downloaded');
        }
        
        downloadBlob(blob, fileName);
        
        toast({
          title: "Berhasil",
          description: "File berhasil didownload",
        });
        return;
        
      } catch (directUrlErr) {
        console.log('Method 3 failed:', directUrlErr);
      }

      // All methods failed
      throw new Error('All download methods failed');
      
    } catch (error: any) {
      console.error('=== DOWNLOAD FAILED ===');
      console.error('Error:', error);
      
      // Final fallback: try to open in new tab
      console.log('Fallback: Opening in new tab');
      try {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Info",
          description: "File dibuka di tab baru. Silakan unduh dari browser.",
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Gagal mengunduh file. Error: ${error.message}. Silakan coba tombol 'Lihat' untuk membuka file.`,
        });
      }
    } finally {
      setDownloading(null);
      console.log('=== DOWNLOAD END ===');
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) return;

    try {
      // Extract file path from URL
      const filePath = getFilePathFromUrl(fileUrl);

      if (filePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('soal-files')
          .remove([filePath]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }

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

  if (loading && currentPage === 1) {
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
            <h1 className="text-lg font-semibold">Daftar Soal</h1>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Pencarian & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Cari berdasarkan nama file..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Cari
                </Button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div>
                  <Label>Guru</Label>
                  <Select
                    value={filters.guru_id}
                    onValueChange={(value) => handleFilterChange('guru_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua guru" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua guru</SelectItem>
                      {filterOptions.guru.map((item) => (
                        <SelectItem key={item.user_id} value={item.user_id}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tahun Ajaran</Label>
                  <Select
                    value={filters.tahun_ajaran_id}
                    onValueChange={(value) => handleFilterChange('tahun_ajaran_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua tahun</SelectItem>
                      {filterOptions.tahunAjaran.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Mata Pelajaran</Label>
                  <Select
                    value={filters.mapel_id}
                    onValueChange={(value) => handleFilterChange('mapel_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua mapel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua mapel</SelectItem>
                      {filterOptions.mapel.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Kelas</Label>
                  <Select
                    value={filters.kelas_id}
                    onValueChange={(value) => handleFilterChange('kelas_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua kelas</SelectItem>
                      {filterOptions.kelas.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Jenis Ujian</Label>
                  <Select
                    value={filters.jenis_ujian_id}
                    onValueChange={(value) => handleFilterChange('jenis_ujian_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua jenis</SelectItem>
                      {filterOptions.jenisUjian.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button variant="outline" onClick={clearFilters}>
                Reset Filter
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Daftar Soal Ujian
                  </CardTitle>
                  <CardDescription>
                    Menampilkan {soalUploads.length} dari {totalCount} soal
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : soalUploads.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Tidak ada soal yang ditemukan
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File</TableHead>
                          <TableHead>Guru</TableHead>
                           <TableHead>Mata Pelajaran</TableHead>
                           <TableHead>Kelas</TableHead>
                           <TableHead>Jenis Ujian</TableHead>
                           <TableHead>Semester</TableHead>
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
                                {item.guru?.nama}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {item.mapel?.nama}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {item.kelas_names?.map((namaKelas, index) => (
                                  <Badge key={index} variant="outline">
                                    {namaKelas}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                             <TableCell>
                               <Badge variant="outline">
                                 {item.jenis_ujian?.nama}
                               </Badge>
                             </TableCell>
                             <TableCell>
                               <Badge variant="outline" className="capitalize">
                                 {item.semester}
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
                                  title="Lihat file"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownload(item.file_url, item.file_name, item.id)}
                                  disabled={downloading === item.id}
                                  title="Unduh file"
                                >
                                  {downloading === item.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                  ) : (
                                    <Download className="h-4 w-4" />
                                  )}
                                </Button>
                                {/* Debug button - remove in production */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const filePath = getFilePathFromUrl(item.file_url);
                                    console.log('=== DEBUG INFO ===');
                                    console.log('File Name:', item.file_name);
                                    console.log('File URL:', item.file_url);
                                    console.log('Parsed Path:', filePath);
                                    console.log('File Size:', item.file_size);
                                    toast({
                                      title: "Debug Info (Lihat Console)",
                                      description: `Path: ${filePath}`,
                                    });
                                  }}
                                  title="Debug info (lihat console)"
                                  className="text-xs"
                                >
                                  🐛
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(item.id, item.file_url)}
                                  title="Hapus file"
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Halaman {currentPage} dari {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Sebelumnya
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <Button
                                key={pageNum}
                                variant={pageNum === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Selanjutnya
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DaftarSoal;
