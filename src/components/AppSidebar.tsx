import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Megaphone,
  Upload,
  Home,
  LogOut
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const adminItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Kelola Guru', url: '/admin/guru', icon: Users },
  { title: 'Tahun Ajaran', url: '/admin/tahun-ajaran', icon: Calendar },
  { title: 'Mata Pelajaran', url: '/admin/mapel', icon: BookOpen },
  { title: 'Kelas', url: '/admin/kelas', icon: GraduationCap },
  { title: 'Jenis Ujian', url: '/admin/jenis-ujian', icon: FileText },
  { title: 'Daftar Soal', url: '/admin/daftar-soal', icon: FileText },
  { title: 'Pengumuman', url: '/admin/pengumuman', icon: Megaphone },
];

const guruItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Upload Soal', url: '/guru/upload', icon: Upload },
  { title: 'Riwayat Soal', url: '/guru/riwayat', icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile, signOut, isAdmin, isGuru } = useAuth();
  const currentPath = location.pathname;

  const items = isAdmin ? adminItems : guruItems;
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/50';

  const collapsed = state === 'collapsed';

  return (
    <Sidebar
      className={collapsed ? 'w-14' : 'w-60'}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-sidebar-primary" />
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Soal Keeper</h2>
              <p className="text-xs text-sidebar-foreground/60">
                {isAdmin ? 'Admin Dashboard' : 'Guru Dashboard'}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <BookOpen className="h-6 w-6 text-sidebar-primary" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && (isAdmin ? 'Admin Menu' : 'Menu Guru')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && profile && (
          <div className="space-y-2">
            <div className="text-sm">
              <p className="font-medium text-sidebar-foreground">{profile.nama}</p>
              <p className="text-xs text-sidebar-foreground/60">
                {profile.role === 'admin' ? 'Administrator' : 'Guru'}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
        {collapsed && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="w-full p-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}