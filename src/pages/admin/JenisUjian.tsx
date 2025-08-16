import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';

interface JenisUjian {
  id: string;
  nama: string;
  created_at: string;
}

const JenisUjian = () => {
  const [jenisUjian, setJenisUjian] = useState<JenisUjian[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JenisUjian | null>(null);
  const [formData, setFormData] = useState({ nama: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchJenisUjian();
  }, []);

  const fetchJenisUjian = async () => {
    try {
      const { data, error } = await supabase
        .from('jenis_ujian')
        .select('*')
        .order('nama');

      if (error) throw error;
      setJenisUjian(data || []);
    } catch (error) {
      console.error('Error fetching jenis ujian:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data jenis ujian",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('jenis_ujian')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Jenis ujian berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('jenis_ujian')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Jenis ujian berhasil ditambahkan",
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({ nama: '' });
      fetchJenisUjian();
    } catch (error: any) {
      console.error('Error saving jenis ujian:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (item: JenisUjian) => {
    setEditingItem(item);
    setFormData({ nama: item.nama });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jenis ujian ini?')) return;

    try {
      const { error } = await supabase
        .from('jenis_ujian')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Jenis ujian berhasil dihapus",
      });
      fetchJenisUjian();
    } catch (error: any) {
      console.error('Error deleting jenis ujian:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus jenis ujian",
      });
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
            <h1 className="text-lg font-semibold">Jenis Ujian</h1>
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Data Jenis Ujian
                  </CardTitle>
                  <CardDescription>
                    Kelola data jenis ujian yang digunakan di sistem
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingItem(null);
                      setFormData({ nama: '' });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Jenis Ujian
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? 'Edit Jenis Ujian' : 'Tambah Jenis Ujian'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingItem 
                          ? 'Perbarui informasi jenis ujian' 
                          : 'Isi form untuk menambah jenis ujian baru'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="nama">Nama Jenis Ujian</Label>
                        <Input
                          id="nama"
                          placeholder="contoh: UTS"
                          value={formData.nama}
                          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {editingItem ? 'Perbarui' : 'Tambah'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Jenis Ujian</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jenisUjian.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default JenisUjian;