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
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';

interface Mapel {
  id: string;
  nama: string;
  created_at: string;
}

const MataPelajaran = () => {
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Mapel | null>(null);
  const [formData, setFormData] = useState({ nama: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchMapel();
  }, []);

  const fetchMapel = async () => {
    try {
      const { data, error } = await supabase
        .from('mapel')
        .select('*')
        .order('nama');

      if (error) throw error;
      setMapel(data || []);
    } catch (error) {
      console.error('Error fetching mapel:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data mata pelajaran",
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
          .from('mapel')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Mata pelajaran berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('mapel')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Mata pelajaran berhasil ditambahkan",
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({ nama: '' });
      fetchMapel();
    } catch (error: any) {
      console.error('Error saving mapel:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (item: Mapel) => {
    setEditingItem(item);
    setFormData({ nama: item.nama });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) return;

    try {
      const { error } = await supabase
        .from('mapel')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Mata pelajaran berhasil dihapus",
      });
      fetchMapel();
    } catch (error: any) {
      console.error('Error deleting mapel:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus mata pelajaran",
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
            <h1 className="text-lg font-semibold">Mata Pelajaran</h1>
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Data Mata Pelajaran
                  </CardTitle>
                  <CardDescription>
                    Kelola data mata pelajaran yang digunakan di sistem
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingItem(null);
                      setFormData({ nama: '' });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Mata Pelajaran
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingItem 
                          ? 'Perbarui informasi mata pelajaran' 
                          : 'Isi form untuk menambah mata pelajaran baru'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="nama">Nama Mata Pelajaran</Label>
                        <Input
                          id="nama"
                          placeholder="contoh: Matematika"
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
                    <TableHead>Nama Mata Pelajaran</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mapel.map((item) => (
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

export default MataPelajaran;