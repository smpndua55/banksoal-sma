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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Megaphone, Code } from 'lucide-react';

interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  is_active: boolean;
  created_at: string;
}

const Pengumuman = () => {
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pengumuman | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
    tanggal: new Date().toISOString().split('T')[0],
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const fetchPengumuman = async () => {
    try {
      const { data, error } = await supabase
        .from('pengumuman')
        .select('*')
        .order('tanggal', { ascending: false });

      if (error) throw error;
      setPengumuman(data || []);
    } catch (error) {
      console.error('Error fetching pengumuman:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data pengumuman",
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
          .from('pengumuman')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Pengumuman berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('pengumuman')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Pengumuman berhasil ditambahkan",
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({
        judul: '',
        isi: '',
        tanggal: new Date().toISOString().split('T')[0],
        is_active: true
      });
      fetchPengumuman();
    } catch (error: any) {
      console.error('Error saving pengumuman:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (item: Pengumuman) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      isi: item.isi,
      tanggal: item.tanggal,
      is_active: item.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;

    try {
      const { error } = await supabase
        .from('pengumuman')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Pengumuman berhasil dihapus",
      });
      fetchPengumuman();
    } catch (error: any) {
      console.error('Error deleting pengumuman:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus pengumuman",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pengumuman')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Status pengumuman berhasil diperbarui",
      });
      fetchPengumuman();
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
            <h1 className="text-lg font-semibold">Pengumuman</h1>
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Data Pengumuman
                  </CardTitle>
                  <CardDescription>
                    Kelola pengumuman yang ditampilkan di sistem
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingItem(null);
                      setFormData({
                        judul: '',
                        isi: '',
                        tanggal: new Date().toISOString().split('T')[0],
                        is_active: true
                      });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Pengumuman
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingItem 
                          ? 'Perbarui informasi pengumuman' 
                          : 'Isi form untuk menambah pengumuman baru'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="judul">Judul Pengumuman</Label>
                        <Input
                          id="judul"
                          value={formData.judul}
                          onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="isi">Isi Pengumuman</Label>
                        <Tabs defaultValue="editor" className="w-full mt-2">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="editor">Rich Editor</TabsTrigger>
                            <TabsTrigger value="html">
                              <Code className="h-4 w-4 mr-2" />
                              HTML
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="editor" className="mt-4">
                            <RichTextEditor
                              value={formData.isi}
                              onChange={(value) => setFormData({ ...formData, isi: value })}
                              placeholder="Masukkan isi pengumuman..."
                            />
                          </TabsContent>
                          <TabsContent value="html" className="mt-4">
                            <Textarea
                              id="isi"
                              rows={8}
                              value={formData.isi}
                              onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                              placeholder="Masukkan HTML untuk isi pengumuman..."
                              className="font-mono text-sm"
                            />
                          </TabsContent>
                        </Tabs>
                      </div>
                      <div>
                        <Label htmlFor="tanggal">Tanggal</Label>
                        <Input
                          id="tanggal"
                          type="date"
                          value={formData.tanggal}
                          onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
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
                    <TableHead>Judul</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengumuman.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.judul}</div>
                          <div 
                            className="text-sm text-muted-foreground max-w-xs overflow-hidden"
                            dangerouslySetInnerHTML={{ 
                              __html: item.isi.length > 100 
                                ? item.isi.substring(0, 100) + '...' 
                                : item.isi 
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(item.tanggal).toLocaleDateString('id-ID')}
                      </TableCell>
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

export default Pengumuman;