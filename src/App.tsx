import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
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
import DaftarSoal from "./pages/admin/DaftarSoal";
import Pengumuman from "./pages/admin/Pengumuman";
// Teacher pages
import UploadSoal from "./pages/guru/UploadSoal";
import RiwayatSoal from "./pages/guru/RiwayatSoal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Main App Container - Responsive Layout */}
      <div className="min-h-screen bg-background font-sans antialiased">
        {/* Toast Notifications - Fixed positioning for all screen sizes */}
        <Toaster />
        <Sonner />
        
        <AuthProvider>
          <BrowserRouter>
            <SidebarProvider 
              defaultOpen={true} // Desktop default
              className="min-h-screen"
            >
              {/* Main Content Area with Responsive Padding */}
              <div className="flex min-h-screen w-full">
                {/* Sidebar area - handled by SidebarProvider */}
                
                {/* Main Content */}
                <main className="flex-1 overflow-hidden">
                  {/* Content wrapper with responsive padding */}
                  <div className="h-full px-4 py-4 md:px-6 md:py-6 lg:px-8">
                    <Routes>
                      {/* Auth Route - Full width on all devices */}
                      <Route 
                        path="/auth" 
                        element={
                          <div className="flex min-h-screen items-center justify-center">
                            <Auth />
                          </div>
                        } 
                      />
                      
                      {/* Dashboard Route */}
                      <Route path="/" element={
                        <ProtectedRoute>
                          <div className="space-y-4 md:space-y-6">
                            <Index />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      {/* Admin Routes */}
                      <Route path="/admin/guru" element={
                        <ProtectedRoute requireAdmin>
                          <div className="space-y-4 md:space-y-6">
                            <ManageTeachers />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/tahun-ajaran" element={
                        <ProtectedRoute requireAdmin>
                          <div className="space-y-4 md:space-y-6">
                            <TahunAjaran />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/mapel" element={
                        <ProtectedRoute requireAdmin>
                          <div className="space-y-4 md:space-y-6">
                            <MataPelajaran />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/kelas" element={
                        <ProtectedRoute requireAdmin>
                          <div className="space-y-4 md:space-y-6">
                            <Kelas />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/jenis-ujian" element={
                        <ProtectedRoute requireAdmin>
                          <div className="space-y-4 md:space-y-6">
                            <JenisUjian />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/daftar-soal" element={
                        <ProtectedRoute requireAdmin>
                          <div className="space-y-4 md:space-y-6">
                            <DaftarSoal />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/pengumuman" element={
                        <ProtectedRoute requireAdmin>
                          <div className="space-y-4 md:space-y-6">
                            <Pengumuman />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      {/* Teacher Routes */}
                      <Route path="/guru/upload" element={
                        <ProtectedRoute>
                          <div className="space-y-4 md:space-y-6">
                            <UploadSoal />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/guru/riwayat" element={
                        <ProtectedRoute>
                          <div className="space-y-4 md:space-y-6">
                            <RiwayatSoal />
                          </div>
                        </ProtectedRoute>
                      } />
                      
                      {/* 404 Not Found */}
                      <Route 
                        path="*" 
                        element={
                          <div className="flex min-h-[50vh] items-center justify-center">
                            <NotFound />
                          </div>
                        } 
                      />
                    </Routes>
                  </div>
                </main>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
