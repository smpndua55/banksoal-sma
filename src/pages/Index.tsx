import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnnouncementCard from '@/components/AnnouncementCard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Info, BookOpen, Users, Upload, FileText } from 'lucide-react';

interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  is_active: boolean;
}

interface DashboardStats {
  totalSoal?: number;
  totalGuru?: number;
  totalMapel?: number;
  totalKelas?: number;
}

const Index = () => {
  const { profile, isAdmin, isGuru } = useAuth();
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch pengumuman
      const { data: pengumumanData } = await supabase
        .from('pengumuman')
        .select('*')
        .eq('is_active', true)
        .order('tanggal', { ascending: false })
        .limit(5);

      if (pengumumanData) {
        setPengumuman(pengumumanData);
      }

      // Fetch stats based on role
      if (isAdmin) {
        const [soalResult, guruResult, mapelResult, kelasResult] = await Promise.all([
          supabase.from('soal_uploads').select('id', { count: 'exact' }),
          supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'guru'),
          supabase.from('mapel').select('id', { count: 'exact' }),
          supabase.from('kelas').select('id', { count: 'exact' })
        ]);

        setStats({
          totalSoal: soalResult.count || 0,
          totalGuru: guruResult.count || 0,
          totalMapel: mapelResult.count || 0,
          totalKelas: kelasResult.count || 0
        });
      } else if (isGuru && profile?.user_id) {
        const { count } = await supabase
          .from('soal_uploads')
          .select('id', { count: 'exact' })
          .eq('guru_id', profile.user_id);

        setStats({ totalSoal: count || 0 });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Soal</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSoal}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuru}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mata Pelajaran</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMapel}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKelas}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const GuruDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soal Saya</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSoal}</div>
            <p className="text-xs text-muted-foreground">
              Total soal yang telah diupload
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

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
            <h1 className="text-lg font-semibold">
              Dashboard {isAdmin ? 'Admin' : 'Guru'}
            </h1>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Selamat datang, {profile?.nama}!
            </h2>
            <p className="text-muted-foreground">
              {isAdmin 
                ? 'Kelola sistem manajemen soal ujian dari dashboard admin' 
                : 'Upload dan kelola soal ujian Anda'
              }
            </p>
          </div>

          {isAdmin ? <AdminDashboard /> : <GuruDashboard />}

          {pengumuman.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Pengumuman Terbaru
                </h3>
                <div className="space-y-4">
                  {pengumuman.map((item) => (
                    <AnnouncementCard
                      key={item.id}
                      title={item.judul}
                      content={item.isi}
                      date={item.tanggal}
                      isActive={item.is_active}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
