import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { AuthMode, LoginMethod } from '../types';
import { Mail, KeyRound, Loader2, ArrowRight, Heart, Phone, Lock, Sparkles, Info } from 'lucide-react';
import { Input, Label } from './common/FormComponents';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('PASSWORD');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    console.log(`[Auth] Switching mode to: ${mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'}`);
    setMode(prev => prev === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
    setError(null);
    setOtpSent(false);
  };

  const handleGoogleLogin = async () => {
    console.log('[Auth] Google Login clicked');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err: any) {
      console.error('[Auth] Google Login failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log(`[Auth] Submitting form. Mode: ${mode}, Method: ${loginMethod}`);

    try {
      if (mode === 'SIGNUP') {
        console.log('[Auth] Attempting Signup', { email, phone });
        // Simulating Sign up
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { phone } }
        });
        if (error) throw error;
      } else {
        // LOGIN MODE
        if (loginMethod === 'PASSWORD') {
            console.log('[Auth] Attempting Password Login', { email });
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } else {
            // OTP LOGIN
            if (!otpSent) {
                console.log('[Auth] Requesting OTP', { email });
                const { error } = await supabase.auth.signInWithOtp({ email });
                if (error) throw error;
                setOtpSent(true);
            } else {
                console.log('[Auth] Verifying OTP', { email, otp });
                const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
                if (error) throw error;
            }
        }
      }
    } catch (err: any) {
      console.error('[Auth] Error:', JSON.stringify(err, null, 2));
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (type: 'MALE' | 'FEMALE') => {
      setEmail(type === 'MALE' ? 'male@test.com' : 'female@test.com');
      setPassword('password123');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-100 px-4 font-sans">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-rose-100 transition-all duration-300">
        
        {/* Header Section */}
        <div className={`p-8 text-center relative overflow-hidden transition-colors duration-500 ${mode === 'LOGIN' ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-violet-600 to-indigo-600'}`}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-md">
                <Heart className="h-8 w-8 text-white fill-current" />
             </div>
             <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">MatchFind</h1>
             <p className="text-white/90 font-medium text-sm">
                 {mode === 'LOGIN' ? 'Welcome Back!' : 'Start Your Journey'}
             </p>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start shadow-sm">
              <span className="font-medium mr-1">Error:</span> {error}
            </div>
          )}

          {/* Test Credentials Hint */}
          {mode === 'LOGIN' && loginMethod === 'PASSWORD' && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
                  <div className="flex items-center gap-2 mb-2 font-bold">
                      <Info className="w-4 h-4"/> Demo Credentials
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => fillCredentials('MALE')} className="bg-white p-2 rounded border border-blue-200 hover:border-blue-400 transition-colors text-left shadow-sm">
                        <div className="font-bold">Male User</div>
                        <div className="opacity-70">male@test.com</div>
                        <div className="opacity-70">password123</div>
                    </button>
                    <button onClick={() => fillCredentials('FEMALE')} className="bg-white p-2 rounded border border-blue-200 hover:border-blue-400 transition-colors text-left shadow-sm">
                        <div className="font-bold">Female User</div>
                        <div className="opacity-70">female@test.com</div>
                        <div className="opacity-70">password123</div>
                    </button>
                  </div>
              </div>
          )}

          {/* Google Button */}
          {mode === 'LOGIN' && (
             <button 
               onClick={handleGoogleLogin}
               className="w-full flex justify-center items-center py-3 px-4 mb-6 border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all group"
             >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
                Continue with Google
             </button>
          )}

          {/* Login Tabs */}
          {mode === 'LOGIN' && (
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button 
                    onClick={() => setLoginMethod('PASSWORD')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginMethod === 'PASSWORD' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Password
                </button>
                <button 
                    onClick={() => setLoginMethod('OTP')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${loginMethod === 'OTP' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    OTP / Magic Link
                </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAction} className="space-y-4">
            
            {/* Common Email Field */}
            <div>
              <Label>Email Address</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-rose-500 transition-colors" />
                </div>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Signup Fields */}
            {mode === 'SIGNUP' && (
                <>
                    <div>
                        <Label>Phone Number</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-300 group-focus-within:text-rose-500 transition-colors" />
                            </div>
                            <Input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="pl-10"
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Password Field (Login-Password OR Signup) */}
            {(mode === 'SIGNUP' || (mode === 'LOGIN' && loginMethod === 'PASSWORD')) && (
                <div>
                    <Label>{mode === 'SIGNUP' ? 'Create Password' : 'Password'}</Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-300 group-focus-within:text-rose-500 transition-colors" />
                        </div>
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            )}

            {/* OTP Field */}
            {mode === 'LOGIN' && loginMethod === 'OTP' && otpSent && (
                <div>
                    <Label>Verification Code</Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyRound className="h-5 w-5 text-gray-300 group-focus-within:text-rose-500 transition-colors" />
                        </div>
                        <Input
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="pl-10 tracking-widest font-mono"
                            placeholder="123456"
                        />
                    </div>
                </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 ${mode === 'LOGIN' ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}`}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>
                  {mode === 'LOGIN' ? (loginMethod === 'OTP' && !otpSent ? 'Send Code' : 'Sign In') : 'Create Account'} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

            {/* Signup Mode Google Button (Different Color) */}
            {mode === 'SIGNUP' && (
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or sign up with</span></div>
                    </div>
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full mt-4 flex justify-center items-center py-3 px-4 border border-indigo-100 rounded-xl shadow-sm text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
                        Google Account
                    </button>
                </div>
            )}

            {/* Toggle Link */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    {mode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        type="button" 
                        onClick={toggleMode}
                        className={`font-bold hover:underline ${mode === 'LOGIN' ? 'text-rose-600' : 'text-indigo-600'}`}
                    >
                        {mode === 'LOGIN' ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>

        </div>
      </div>
    </div>
  );
}
