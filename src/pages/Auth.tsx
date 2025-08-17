import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Eye, EyeOff, AlertCircle, Lock, Mail, User, Book } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth: React.FC = () => {
  // ... (bagian state dan fungsi tetap sama seperti sebelumnya)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Bagian Ilustrasi */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 hidden md:flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-12">
            <Book className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Bank Soal</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-500/20 p-4 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Platform Belajar Modern</h3>
              <p className="text-sm opacity-90">Akses ribuan soal berkualitas untuk meningkatkan kemampuan akademik</p>
            </div>
            
            <div className="bg-blue-500/20 p-4 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Untuk Guru & Siswa</h3>
              <p className="text-sm opacity-90">Kelola materi ujian dengan mudah dan efisien</p>
            </div>
          </div>
          
          <p className="text-sm opacity-80 mt-auto">© 2024 Bank Soal. All rights reserved</p>
        </div>

        {/* Bagian Form */}
        <div className="w-full md:w-3/5 py-10 px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex justify-center">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {activeTab === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
            </h1>
            <p className="mt-3 text-gray-600 max-w-md mx-auto">
              {activeTab === 'login' 
                ? 'Masukkan kredensial Anda untuk mengakses platform' 
                : 'Daftar sekarang untuk mulai menggunakan Bank Soal'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {activeTab === 'login' ? (
            // Login Form (Modern Design)
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full py-5 px-10 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
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
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full py-5 px-10 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                    placeholder="Masukkan password"
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
                  className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-5 px-4 rounded-xl text-base shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </div>
                  ) : (
                    'Masuk Sekarang'
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
                    Daftar disini
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // Signup Form (Modern Design)
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signup-nama" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <Input
                      id="signup-nama"
                      name="nama"
                      type="text"
                      autoComplete="name"
                      required
                      value={signupNama}
                      onChange={(e) => setSignupNama(e.target.value)}
                      className="w-full py-4 px-10 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Nama lengkap"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <Input
                      id="signup-username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      className="w-full py-4 px-10 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Username unik"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full py-4 px-10 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full py-4 px-10 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                      placeholder="Minimal 6 karakter"
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
                  <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full py-4 px-10 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Konfirmasi password"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-5 px-4 rounded-xl text-base shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Membuat akun...
                    </div>
                  ) : (
                    'Daftar Sekarang'
                  )}
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    className="font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => setActiveTab('login')}
                  >
                    Masuk disini
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Default Password Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700 text-center">
              <strong>Info:</strong> Password default untuk guru adalah{' '}
              <code className="bg-blue-100 px-2 py-1 rounded-lg font-mono text-xs">guru123456</code>
            </p>
          </div>

          {/* Footer Mobile */}
          <div className="mt-8 text-center md:hidden">
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
    </div>
  );
};

export default Auth;
