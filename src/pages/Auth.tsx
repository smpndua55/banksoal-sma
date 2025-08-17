import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';

const Auth: React.FC = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Bank Soal</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Sistem Manajemen Soal Ujian
                </p>
              </div>
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100 dark:bg-slate-700 p-1">
                <TabsTrigger 
                  value="login" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <LogIn className="h-4 w-4" />
                  Masuk
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Daftar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-0 mt-0">
                <CardHeader className="pb-6 pt-6">
                  <CardTitle className="text-2xl font-semibold text-center text-slate-900 dark:text-slate-100">
                    Selamat Datang
                  </CardTitle>
                  <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                    Masukkan kredensial Anda untuk mengakses sistem
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Alamat Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="nama@example.com"
                        className="h-12 border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Kata Sandi
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-primary/20"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-sm font-semibold bg-primary hover:bg-primary/90 transition-colors" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Memproses...
                        </div>
                      ) : (
                        'Masuk ke Sistem'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="signup" className="space-y-0 mt-0">
                <CardHeader className="pb-6 pt-6">
                  <CardTitle className="text-2xl font-semibold text-center text-slate-900 dark:text-slate-100">
                    Buat Akun Baru
                  </CardTitle>
                  <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                    Daftarkan diri Anda sebagai guru
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-nama" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Nama Lengkap
                        </Label>
                        <Input
                          id="signup-nama"
                          type="text"
                          value={signupNama}
                          onChange={(e) => setSignupNama(e.target.value)}
                          placeholder="Nama lengkap"
                          className="h-11 border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Username
                        </Label>
                        <Input
                          id="signup-username"
                          type="text"
                          value={signupUsername}
                          onChange={(e) => setSignupUsername(e.target.value)}
                          placeholder="username"
                          className="h-11 border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Alamat Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="nama@example.com"
                        className="h-11 border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Kata Sandi
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-primary/20"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-sm font-semibold bg-primary hover:bg-primary/90 transition-colors" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Memproses...
                        </div>
                      ) : (
                        'Daftar Akun'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="text-center mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Password default guru: <code className="font-mono font-semibold">guru123456</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 py-6">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Bank Soal Created by{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">Rudy Susanto</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;