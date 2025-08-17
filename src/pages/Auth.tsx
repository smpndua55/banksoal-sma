import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, LogIn, UserPlus, Eye, EyeOff, Info } from 'lucide-react';

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

  if (user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
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
      setSignupEmail('');
      setSignupPassword('');
      setSignupNama('');
      setSignupUsername('');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200/50 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Section */}
            <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 p-10 text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-lg mb-6">
                <BookOpen className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Bank Soal</h2>
              <p className="text-center text-blue-100 max-w-xs">
                Sistem manajemen soal ujian dengan tampilan modern, aman, dan mudah digunakan.
              </p>
            </div>

            {/* Right Section */}
            <div className="p-8 md:p-10">
              <CardHeader className="text-center mb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                  Selamat Datang
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Masuk atau buat akun baru untuk melanjutkan
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  {/* Tab Navigation */}
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/80 p-1 h-11 rounded-xl">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-medium rounded-lg transition-all"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Masuk
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-medium rounded-lg transition-all"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Daftar
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Form */}
                  <TabsContent value="login" className="space-y-5">
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="h-12"
                          placeholder="Masukkan email Anda"
                          autoComplete="email"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="h-12 pr-12"
                            placeholder="Masukkan password Anda"
                            autoComplete="current-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
                      >
                        {isLoading ? 'Memproses...' : 'Masuk ke Sistem'}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Signup Form */}
                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-nama">Nama Lengkap</Label>
                          <Input
                            id="signup-nama"
                            type="text"
                            value={signupNama}
                            onChange={(e) => setSignupNama(e.target.value)}
                            className="h-11"
                            placeholder="Nama lengkap"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-username">Username</Label>
                          <Input
                            id="signup-username"
                            type="text"
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                            className="h-11"
                            placeholder="Username"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="h-11"
                          placeholder="Masukkan email Anda"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="h-11 pr-12"
                            placeholder="Buat password Anda"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md mt-4"
                      >
                        {isLoading ? 'Membuat akun...' : 'Buat Akun'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Info Login</h4>
              <p className="text-sm text-blue-700 mt-1">
                Password default guru:{' '}
                <code className="bg-blue-100 px-2 py-0.5 rounded text-xs font-mono">guru123456</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2024 Bank Soal • Dibuat oleh{' '}
            <span className="font-medium text-gray-700">Rudy Susanto</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
