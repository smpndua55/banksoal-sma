import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface TahunAjaran {
  id: string;
  nama: string;
  is_active: boolean;
  created_at: string;
}

const TahunAjaran = () => {
  const [tahunAjaran, setTahunAjaran] = useState<TahunAjaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TahunAjaran | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    is_active: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTahunAjaran();
  }, []);

  const fetchTahunAjaran = async () => {
    try {
      const { data, error } = await supabase
        .from('tahun_ajaran')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTahunAjaran(data || []);
    } catch (error) {
      console.error('Error fetching tahun ajaran:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data tahun ajaran",
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
          .from('tahun_ajaran')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Tahun ajaran berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('tahun_ajaran')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Tahun ajaran berhasil ditambahkan",
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({ nama: '', is_active: false });
      fetchTahunAjaran();
    } catch (error: any) {
      console.error('Error saving tahun ajaran:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (item: TahunAjaran) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      is_active: item.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tahun ajaran ini?')) return;

    try {
      const { error } = await supabase
        .from('tahun_ajaran')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Tahun ajaran berhasil dihapus",
      });
      fetchTahunAjaran();
    } catch (error: any) {
      console.error('Error deleting tahun ajaran:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus tahun ajaran",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('tahun_ajaran')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Status tahun ajaran berhasil diperbarui",
      });
      fetchTahunAjaran();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui status",
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
            <h1 className="text-lg font-semibold">Tahun Ajaran</h1>
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Data Tahun Ajaran
                  </CardTitle>
                  <CardDescription>
                    Kelola data tahun ajaran yang digunakan di sistem
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingItem(null);
                      setFormData({ nama: '', is_active: false });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Tahun Ajaran
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingItem 
                          ? 'Perbarui informasi tahun ajaran' 
                          : 'Isi form untuk menambah tahun ajaran baru'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="nama">Nama Tahun Ajaran</Label>
                        <Input
                          id="nama"
                          placeholder="contoh: 2024/2025"
                          value={formData.nama}
                          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label htmlFor="is_active">Aktif</Label>
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
                    <TableHead>Nama Tahun Ajaran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tahunAjaran.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.is_active ? "default" : "secondary"}>
                            {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                          </Badge>
                          <Switch
                            checked={item.is_active}
                            onCheckedChange={() => toggleActive(item.id, item.is_active)}
                          />
                        </div>
                      </TableCell>
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

export default TahunAjaran;