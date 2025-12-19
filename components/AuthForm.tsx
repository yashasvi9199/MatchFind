import { useState, FormEvent, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { AuthMode, LoginMethod } from '../types';
import { Mail, KeyRound, Loader2, ArrowRight, Heart, Phone, Lock, Smartphone, Download } from 'lucide-react';
import { Input, Label } from './common/FormComponents';
import CoupleAnimation from './CoupleAnimation';

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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Mobile Detection - initialize synchronously to prevent animation flash
  const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;
  const [isMobile, setIsMobile] = useState(getIsMobile);
  
  // Android APK URL state
  const [androidApkUrl, setAndroidApkUrl] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch latest release APK URL
  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/yashasvi9199/MatchFind/releases/latest');
        if (res.ok) {
          const data = await res.json();
          // Find the APK asset
          const apkAsset = data.assets?.find((asset: { name: string }) => asset.name.endsWith('.apk'));
          if (apkAsset) {
            setAndroidApkUrl(apkAsset.browser_download_url);
          }
        }
      } catch (err) {
        console.log('[Auth] Could not fetch latest release:', err);
      }
    };
    fetchLatestRelease();
  }, []);

  const toggleMode = () => {
    console.log(`[Auth] Switching mode to: ${mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'}`);
    setMode(prev => prev === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
    setError(null);
    setSuccessMsg(null);
    setOtpSent(false);
  };

  const handleGoogleLogin = async () => {
    console.log('[Auth] Google Login clicked');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('[Auth] Google Login failed:', err);
      const message = err instanceof Error ? err.message : 'An error occurred during Google Login';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    console.log(`[Auth] Submitting form. Mode: ${mode}, Method: ${loginMethod}`);

    try {
      if (mode === 'SIGNUP') {
        // Remove all whitespace and invisible characters
        const cleanEmail = email.replace(/\s+/g, '').toLowerCase();
        
        console.log('[Auth] Supabase Config URL:', supabase['supabaseUrl']); // Debugging
        
        // --- PRE-VALIDATION ---
        if (!cleanEmail || !cleanEmail.includes('@')) {
            setError('Invalid email format');
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }
        // -----------------------

        console.log('[Auth] Attempting Signup', { 
            original: email, 
            cleaned: cleanEmail, 
            passwordLen: password.length 
        });
        
        const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              emailRedirectTo: window.location.origin, // Force redirect back to this app (localhost or prod)
              data: { phone }
            }
        });

        if (error) throw error;
        
        if (data.user && !data.session) {
            setSuccessMsg('Signup successful! Please check your email for the confirmation link.');
            return; // Stop here, don't throw, just show message
        }
        if (error) throw error;
      } else {
        // LOGIN MODE
        // Remove all whitespace and invisible characters
        const cleanEmail = email.replace(/\s+/g, '').toLowerCase();
        
        if (loginMethod === 'PASSWORD') {
            console.log('[Auth] Attempting Password Login', { email: cleanEmail });
            const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
            if (error) throw error;
        } else {
            // OTP LOGIN
            if (!otpSent) {
                console.log('[Auth] Requesting OTP', { email: cleanEmail });
                const { error } = await supabase.auth.signInWithOtp({ email: cleanEmail });
                if (error) throw error;
                setOtpSent(true);
            } else {
                console.log('[Auth] Verifying OTP', { email: cleanEmail, otp });
                const { error } = await supabase.auth.verifyOtp({ email: cleanEmail, token: otp, type: 'email' });
                if (error) throw error;
            }
        }
      }
    } catch (err) {
      console.error('[Auth] Error:', JSON.stringify(err, null, 2));
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Android App Download Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 flex items-center justify-center gap-3 text-sm">
        <Smartphone className="w-4 h-4" />
        <span className="font-medium">Download our Android App!</span>
        {androidApkUrl ? (
          <a 
            href={androidApkUrl} 
            className="bg-white text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-green-50 transition-colors"
          >
            <Download className="w-3 h-3" /> Get APK
          </a>
        ) : (
          <a 
            href="https://github.com/yashasvi9199/MatchFind/releases" 
            target="_blank"
            rel="noreferrer"
            className="bg-white text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-green-50 transition-colors"
          >
            <Download className="w-3 h-3" /> Get APK
          </a>
        )}
      </div>

      <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans overflow-hidden">
        
        {/* Left Side - Animation (Desktop) */}
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-rose-50 relative items-center justify-center overflow-hidden">
           {!isMobile && <CoupleAnimation />}
        </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 sm:p-12 md:bg-white/90 md:backdrop-blur-sm relative z-10">
        <div className="w-full max-w-md space-y-8 md:bg-white/70 md:backdrop-blur-md rounded-3xl p-8 md:shadow-xl md:shadow-rose-100/50 md:border md:border-white/50">
            
            {/* Mobile Header Logo */}
            <div className="md:hidden flex flex-col items-center mb-6">
                 <div className="bg-rose-100 p-3 rounded-full mb-3">
                    <Heart className="h-8 w-8 text-rose-600 fill-current" />
                 </div>
                 <h1 className="text-3xl font-bold text-gray-900 tracking-tight">MatchFind</h1>
                 <p className="text-gray-500 font-medium text-sm mt-1">
                    {mode === 'LOGIN' ? 'Welcome Back!' : 'Start Your Journey'}
                 </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block">
                <h2 className="text-3xl font-bold text-gray-900">
                    {mode === 'LOGIN' ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    {mode === 'LOGIN' ? "Please enter your details to sign in." : "Enter your details to get started."}
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start shadow-sm animate-shake">
                <span className="font-medium mr-1">Error:</span> {error}
                </div>
            )}

            {successMsg && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm flex items-start shadow-sm animate-pulse">
                <span className="font-medium mr-1">Success:</span> {successMsg}
                </div>
            )}

            {/* Google Button */}
            {mode === 'LOGIN' && (
                <button 
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all hover:shadow-md transform hover:-translate-y-0.5 duration-200"
                >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-3" alt="Google" />
                Sign in with Google
                </button>
            )}

            {/* Divider */}
            {mode === 'LOGIN' && (
                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider">Or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>
            )}

            {/* Login Tabs */}
            {mode === 'LOGIN' && (
                <div className="flex p-1 bg-gray-100/80 rounded-xl mb-6">
                    <button 
                        onClick={() => setLoginMethod('PASSWORD')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${loginMethod === 'PASSWORD' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Password
                    </button>
                    <button 
                        onClick={() => setLoginMethod('OTP')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${loginMethod === 'OTP' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        OTP / Magic Link
                    </button>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleAction} className="space-y-5">
                
                {/* Common Email Field */}
                <div>
                <Label className="text-gray-700 font-semibold mb-1.5 block">Email Address</Label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                    </div>
                    <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-all text-base"
                    placeholder="you@example.com"
                    />
                </div>
                </div>

                {/* Signup Fields */}
                {mode === 'SIGNUP' && (
                    <>
                        <div>
                            <Label className="text-gray-700 font-semibold mb-1.5 block">Phone Number</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                                </div>
                                <Input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-11 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-all text-base"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Password Field (Login-Password OR Signup) */}
                {(mode === 'SIGNUP' || (mode === 'LOGIN' && loginMethod === 'PASSWORD')) && (
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <Label className="text-gray-700 font-semibold">{mode === 'SIGNUP' ? 'Create Password' : 'Password'}</Label>
                            {mode === 'LOGIN' && <a href="#" className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline">Forgot?</a>}
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                            </div>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-11 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-all text-base"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                )}

                {/* OTP Field */}
                {mode === 'LOGIN' && loginMethod === 'OTP' && otpSent && (
                    <div>
                        <Label className="text-gray-700 font-semibold mb-1.5 block">Verification Code</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <KeyRound className="h-5 w-5 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                            </div>
                            <Input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="pl-11 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-all text-base tracking-widest font-mono"
                                placeholder="123456"
                            />
                        </div>
                    </div>
                )}

                <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white rounded-xl shadow-lg shadow-rose-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 duration-200"
                >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <>
                    {mode === 'LOGIN' ? (loginMethod === 'OTP' && !otpSent ? 'Send Code' : 'Sign In') : 'Create Account'} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
                </button>
            </form>

            {/* Signup Mode Google Button (Lower priority in UI hierarchy if Login) */}
            {/* If in Signup mode, we show Google button below */}
            {mode === 'SIGNUP' && (
                <div className="mt-6">
                    <div className="relative mb-5">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500 font-medium">Or sign up with</span></div>
                    </div>
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all hover:shadow-md"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-3" alt="Google" />
                        Google Account
                    </button>
                </div>
            )}

            {/* Toggle Link */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                    {mode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        type="button" 
                        onClick={toggleMode}
                        className="font-bold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
                    >
                        {mode === 'LOGIN' ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
    </>
  );
}

