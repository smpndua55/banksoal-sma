import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth: React.FC = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupNama, setSignupNama] = useState('');
  const [signupUsername, setSignupUsername] = useState('');

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
    setSuccessMessage('');
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
        setSuccessMessage('Pendaftaran berhasil! Silakan masuk dengan akun Anda.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center bg-blue-600 rounded-lg shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Bank Soal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistem Manajemen Soal Ujian
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="rounded-none rounded-t-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {successMessage && (
            <Alert className="rounded-none rounded-t-lg bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="w-full p-6" onValueChange={clearMessages}>
            {/* Tab Headers */}
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 rounded-md transition-all"
              >
                Masuk
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 rounded-md transition-all"
              >
                Daftar
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="mb-2 block">
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
                    className="w-full"
                    placeholder="Masukkan email Anda"
                  />
                </div>

                <div>
                  <Label htmlFor="login-password" className="mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pr-10"
                      placeholder="Masukkan password Anda"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="remember-me" className="text-sm">
                      Ingat saya
                    </Label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Lupa password?
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 text-base"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </div>
                    ) : (
                      'Masuk'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="signup-nama" className="mb-2 block">
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
                      placeholder="Nama lengkap"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-username" className="mb-2 block">
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
                      placeholder="Username"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email" className="mb-2 block">
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
                    placeholder="Masukkan email Anda"
                  />
                </div>

                <div>
                  <Label htmlFor="signup-password" className="mb-2 block">
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
                      className="pr-10"
                      placeholder="Masukkan password Anda"
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                  <Label htmlFor="confirm-password" className="mb-2 block">
                    Konfirmasi Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      placeholder="Konfirmasi password Anda"
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 text-base"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </div>
                    ) : (
                      'Daftar'
                    )}
                  </Button>
                </div>

                <div className="text-xs text-gray-600 text-center pt-2">
                  Dengan mendaftar, Anda menyetujui{' '}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Syarat & Ketentuan
                  </a>{' '}
                  dan{' '}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Kebijakan Privasi
                  </a>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          {/* Default Password Info */}
          <div className="bg-blue-50 border-t border-blue-200 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Info:</strong> Password default untuk guru adalah{' '}
                  <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">guru123456</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
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
