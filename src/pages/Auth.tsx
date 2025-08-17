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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">Soal Keeper</h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sistem Manajemen Soal Ujian
            </p>
          </div>

          <Card className="shadow-lg border-0 sm:border">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 sm:h-10">
                <TabsTrigger value="login" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                  Daftar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-0">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Masuk</CardTitle>
                  <CardDescription className="text-sm">
                    Masukkan email dan password untuk login
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="masukkan email"
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="masukkan password"
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-10 sm:h-11 text-sm font-medium" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Memproses...' : 'Login'}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="signup" className="space-y-0">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Daftar Akun Baru</CardTitle>
                  <CardDescription className="text-sm">
                    Buat akun guru baru untuk mengakses sistem
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-nama" className="text-sm font-medium">Nama Lengkap</Label>
                      <Input
                        id="signup-nama"
                        type="text"
                        value={signupNama}
                        onChange={(e) => setSignupNama(e.target.value)}
                        placeholder="masukkan nama lengkap"
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-username" className="text-sm font-medium">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        placeholder="masukkan username"
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="masukkan email"
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="masukkan password"
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-10 sm:h-11 text-sm font-medium" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Memproses...' : 'Daftar'}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
            <p>Default password untuk guru: <code className="bg-muted px-2 py-1 rounded text-xs">guru123456</code></p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur-sm border-t py-4 px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Bank Soal Created by{' '}
            <span className="font-semibold text-foreground">Rudy Susanto</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;