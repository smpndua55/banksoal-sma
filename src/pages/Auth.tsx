import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
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

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupNama, setSignupNama] = useState('');
  const [signupUsername, setSignupUsername] = useState('');

  if (user) return <Navigate to="/" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    await signUp(signupEmail, signupPassword, signupNama, signupUsername);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 md:p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-600 text-white rounded-full shadow">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mt-4">Bank Soal</h1>
          <p className="text-gray-500 text-sm">Masuk atau daftar untuk melanjutkan</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-lg p-1 h-11">
            <TabsTrigger value="login" className="data-[state=active]:bg-white rounded-md text-sm font-medium">
              <LogIn className="w-4 h-4 mr-2" /> Masuk
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white rounded-md text-sm font-medium">
              <UserPlus className="w-4 h-4 mr-2" /> Daftar
            </TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  required
                  className="h-11 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    required
                    className="h-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signup-nama">Nama Lengkap</Label>
                  <Input
                    id="signup-nama"
                    value={signupNama}
                    onChange={(e) => setSignupNama(e.target.value)}
                    placeholder="Nama lengkap"
                    required
                    className="h-11 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="h-11 mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  required
                  className="h-11 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="signup-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Buat password"
                    required
                    className="h-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                {isLoading ? 'Membuat akun...' : 'Buat Akun'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-700">
            Password default guru:{' '}
            <code className="bg-blue-100 px-2 py-0.5 rounded text-xs font-mono">guru123456</code>
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          © 2024 Bank Soal • Dibuat oleh <span className="font-medium">Rudy Susanto</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
