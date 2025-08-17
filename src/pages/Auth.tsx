import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowRight, Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setPageLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nama: '',
    username: ''
  });

  // Mock auth functions for demo
  const signIn = async (email, password) => {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  };

  const signUp = async (email, password, nama, username) => {
    return new Promise(resolve => setTimeout(() => resolve({ error: null }), 1000));
  };

  // Redirect simulation if already authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Login Berhasil!</h2>
          <p className="text-gray-600">Anda akan diarahkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600 font-medium">Memuat...</span>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, formData.nama, formData.username);
        if (!error) {
          setFormData({ email: '', password: '', nama: '', username: '' });
          alert('Akun berhasil dibuat!');
        }
      } else {
        await signIn(formData.email, formData.password);
        setUser({ email: formData.email });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: '', password: '', nama: '', username: '' });
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Soal</h1>
          <p className="text-gray-600">Sistem Manajemen Soal Ujian</p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {isSignUp ? 'Buat Akun Baru' : 'Selamat Datang'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isSignUp 
                ? 'Daftar untuk mengakses sistem' 
                : 'Masuk ke akun Anda untuk melanjutkan'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-5">
              {/* Sign Up Fields */}
              {isSignUp && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama" className="text-sm font-medium text-gray-700">
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="nama"
                        type="text"
                        required
                        value={formData.nama}
                        onChange={(e) => handleInputChange('nama', e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Pilih username"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Masukkan email Anda"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Masukkan password Anda"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Password for Login */}
              {!isSignUp && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-gray-600">Ingat saya</span>
                  </label>
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Lupa password?
                  </a>
                </div>
              )}

              {/* Terms for Sign Up */}
              {isSignUp && (
                <div className="text-xs text-center text-gray-500">
                  Dengan mendaftar, Anda menyetujui{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">
                    Syarat & Ketentuan
                  </a>{' '}
                  kami
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {isSignUp ? 'Buat Akun' : 'Masuk ke Sistem'}
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </div>

            {/* Toggle Mode */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-1 font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {isSignUp ? 'Masuk di sini' : 'Daftar sekarang'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Card - Only show on login */}
        {!isSignUp && (
          <Card className="mt-6 bg-blue-50/80 border-blue-200 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">Informasi Login</p>
                  <p className="text-sm text-blue-700">
                    Password default untuk guru: 
                    <code className="ml-2 bg-blue-100 px-2 py-1 rounded-md font-mono text-xs">
                      guru123456
                    </code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            © 2024 Bank Soal • Dibuat oleh{' '}
            <span className="font-medium text-gray-700">Rudy Susanto</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
