import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth: React.FC = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupNama, setSignupNama] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  
  // Tabs state
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const clearMessages = () => {
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);
    
    try {
      const result = await signIn(loginEmail, loginPassword);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    // Validasi password
    if (signupPassword !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }
    
    if (signupPassword.length < 6) {
      setError('Password harus minimal 6 karakter');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signUp(signupEmail, signupPassword, signupNama, signupUsername);
      
      if (result?.error) {
        setError(result.error);
      } else {
        // Clear form on successful signup
        setSignupEmail('');
        setSignupPassword('');
        setConfirmPassword('');
        setSignupNama('');
        setSignupUsername('');
        setActiveTab('login');
        setError(''); // Clear error on success
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-50">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-normal text-gray-900">
            {activeTab === 'login' ? 'Masuk' : 'Buat Akun'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {activeTab === 'login' 
              ? 'Gunakan akun Bank Soal Anda' 
              : 'Buat akun untuk mengakses sistem'}
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-8 sm:p-10">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {activeTab === 'login' ? (
            // Login Form (Gmail Style)
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full py-5 px-4 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan email Anda"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <a 
                    href="#" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    onClick={(e) => e.preventDefault()}
                  >
                    Lupa password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full py-5 px-4 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                    placeholder="Masukkan password Anda"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Ingat saya
                </Label>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </div>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    className="font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => setActiveTab('signup')}
                  >
                    Buat akun
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="signup-nama" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="signup-nama"
                    name="nama"
                    type="text"
                    autoComplete="name"
                    required
                    value={signupNama}
                    onChange={(e) => setSignupNama(e.target.value)}
                    className="w-full py-3 px-4 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <Label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </Label>
                  <Input
                    id="signup-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="w-full py-3 px-4 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full py-3 px-4 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan email Anda"
                />
              </div>

              <div>
                <Label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full py-3 px-4 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                    placeholder="Masukkan password Anda"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-3 px-4 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Konfirmasi password Anda"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => setActiveTab('login')}
                  >
                    Kembali ke Masuk
                  </button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </div>
                    ) : (
                      'Daftar'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Default Password Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              <strong>Info:</strong> Password default untuk guru adalah{' '}
              <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">guru123456</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Syarat & Ketentuan</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Bantuan</a>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 Bank Soal. Dibuat oleh{' '}
            <span className="font-medium text-gray-700">Rudy Susanto</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
