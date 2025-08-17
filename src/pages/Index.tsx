import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Book, Eye, EyeOff, AlertCircle, Lock, Mail, User } from 'lucide-react';
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

  // Redirect jika sudah login
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

  const clearMessages = () => setError('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    try {
      const result = await signIn(loginEmail, loginPassword);
      if (result?.error) {
        setError(result.error);
      }
    } catch {
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
      const result = await signUp(
        signupEmail,
        signupPassword,
        signupNama,
        signupUsername
      );

      if (result?.error) {
        setError(result.error);
      } else {
        // Reset form setelah sukses
        setSignupEmail('');
        setSignupPassword('');
        setConfirmPassword('');
        setSignupNama('');
        setSignupUsername('');
        setActiveTab('login');
      }
    } catch {
      setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex justify-center">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full">
                <Book className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
            </h1>
            <p className="mt-2 text-gray-600">
              {activeTab === 'login'
                ? 'Masukkan kredensial Anda untuk mengakses platform'
                : 'Daftar sekarang untuk mulai menggunakan Bank Soal'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <Label htmlFor="login-email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Lupa password?
                  </a>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600" />
                <Label htmlFor="remember-me" className="ml-2 text-sm">
                  Ingat saya
                </Label>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
              </Button>

              <p className="text-center text-sm text-gray-600 pt-4">
                Belum punya akun?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setActiveTab('signup')}
                >
                  Daftar disini
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Nama */}
              <div>
                <Label htmlFor="signup-nama">Nama Lengkap</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="signup-nama"
                    type="text"
                    required
                    value={signupNama}
                    onChange={(e) => setSignupNama(e.target.value)}
                    className="pl-10"
                    placeholder="Nama lengkap"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <Label htmlFor="signup-username">Username</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="signup-username"
                    type="text"
                    required
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="pl-10"
                    placeholder="Username unik"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="pl-10"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div>
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Konfirmasi password"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Membuat akun...' : 'Daftar Sekarang'}
              </Button>

              <p className="text-center text-sm text-gray-600 pt-4">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setActiveTab('login')}
                >
                  Masuk disini
                </button>
              </p>
            </form>
          )}

          {/* Info Password Default */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700 text-center">
            <strong>Info:</strong> Password default untuk guru adalah{' '}
            <code className="bg-blue-100 px-2 py-1 rounded font-mono">guru123456</code>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <div className="flex justify-center space-x-6 mb-2">
              <a href="#" className="hover:text-gray-900">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-gray-900">Bantuan</a>
            </div>
            <p>© 2024 Bank Soal. Dibuat oleh <span className="font-medium">Rudy Susanto</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
