import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Admin pages
import ManageTeachers from "./pages/admin/ManageTeachers";
import TahunAjaran from "./pages/admin/TahunAjaran";
import MataPelajaran from "./pages/admin/MataPelajaran";
import Kelas from "./pages/admin/Kelas";
import JenisUjian from "./pages/admin/JenisUjian";
import Pengumuman from "./pages/admin/Pengumuman";

// Teacher pages
import UploadSoal from "./pages/guru/UploadSoal";
import RiwayatSoal from "./pages/guru/RiwayatSoal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/guru" element={
                <ProtectedRoute requireAdmin>
                  <ManageTeachers />
                </ProtectedRoute>
              } />
              <Route path="/admin/tahun-ajaran" element={
                <ProtectedRoute requireAdmin>
                  <TahunAjaran />
                </ProtectedRoute>
              } />
              <Route path="/admin/mapel" element={
                <ProtectedRoute requireAdmin>
                  <MataPelajaran />
                </ProtectedRoute>
              } />
              <Route path="/admin/kelas" element={
                <ProtectedRoute requireAdmin>
                  <Kelas />
                </ProtectedRoute>
              } />
              <Route path="/admin/jenis-ujian" element={
                <ProtectedRoute requireAdmin>
                  <JenisUjian />
                </ProtectedRoute>
              } />
              <Route path="/admin/pengumuman" element={
                <ProtectedRoute requireAdmin>
                  <Pengumuman />
                </ProtectedRoute>
              } />
              
              {/* Teacher Routes */}
              <Route path="/guru/upload" element={
                <ProtectedRoute>
                  <UploadSoal />
                </ProtectedRoute>
              } />
              <Route path="/guru/riwayat" element={
                <ProtectedRoute>
                  <RiwayatSoal />
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
