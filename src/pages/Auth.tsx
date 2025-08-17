import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, LogIn, UserPlus, Eye, EyeOff, GraduationCap, Users, FileText, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';

const Auth: React.FC = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupNama, setSignupNama] = useState('');
  const [signupUsername, setSignupUsername] = useState('');

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await signIn(loginEmail, loginPassword);
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signUp(signupEmail, signupPassword, signupNama, signupUsername);
    
    if (!error) {
      // Clear form on successful signup
      setSignupEmail('');
      setSignupPassword('');
      setSignupNama('');
      setSignupUsername('');
    }
    
    setIsLoading(false);
  };

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "Bank Soal Lengkap",
      description: "Ribuan soal berkualitas dari berbagai mata pelajaran"
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: "Kolaborasi Tim",
      description: "Bekerja sama dengan guru lain dalam membuat soal"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      title: "Analisis Mendalam",
      description: "Statistik dan analisis hasil ujian yang detail"
    }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-md animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          {/* Logo and Title */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl xl:text-5xl font-bold">Bank Soal</h1>
                <p className="text-blue-100 text-lg xl:text-xl">Sistem Manajemen Soal Ujian</p>
              </div>
            </div>
            
            <div className="space-y-4 text-lg xl:text-xl text-blue-100 leading-relaxed">
              <p>Kelola dan organisir soal ujian Anda dengan mudah dan efisien.</p>
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span>Platform modern untuk pendidik masa kini</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="p-2 bg-white/20 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-blue-200 text-sm">Soal Tersedia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-blue-200 text-sm">Guru Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200 text-sm">Sekolah</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Bank Soal</h1>
                <p className="text-sm text-gray-600">Sistem Manajemen Soal</p>
              </div>
            </div>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Selamat Datang
              </CardTitle>
              <CardDescription className="text-gray-600">
                Silakan masuk untuk mengakses sistem
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <Tabs defaultValue="login" className="w-full">
                {/* Tab Headers */}
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl h-12">
                  <TabsTrigger 
                    value="login"
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 font-medium rounded-lg"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 font-medium rounded-lg"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Daftar
                  </TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="space-y-5">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                        placeholder="Masukkan email Anda"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl pr-12"
                          placeholder="Masukkan password Anda"
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                      </label>
                      <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Lupa password?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Memproses...
                        </div>
                      ) : (
                        'Masuk ke Sistem'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama" className="text-sm font-semibold text-gray-700">
                          Nama Lengkap
                        </Label>
                        <Input
                          id="nama"
                          type="text"
                          autoComplete="name"
                          required
                          value={signupNama}
                          onChange={(e) => setSignupNama(e.target.value)}
                          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                          placeholder="Nama lengkap"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                          Username
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          autoComplete="username"
                          required
                          value={signupUsername}
                          onChange={(e) => setSignupUsername(e.target.value)}
                          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                          placeholder="Username"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                        placeholder="Masukkan email Anda"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl pr-12"
                          placeholder="Masukkan password Anda"
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Memproses...
                        </div>
                      ) : (
                        'Buat Akun'
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      Dengan mendaftar, Anda menyetujui{' '}
                      <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Default Password Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Informasi Login</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Password default guru: <code className="bg-blue-100 px-2 py-0.5 rounded font-mono">guru123456</code>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              © 2024 Bank Soal • Dibuat dengan ❤️ oleh{' '}
              <span className="font-semibold text-gray-700">Rudy Susanto</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

