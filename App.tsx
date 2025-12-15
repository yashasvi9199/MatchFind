import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes (SignIn, SignOut, Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading MatchFind...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!session ? (
        <AuthForm />
      ) : (
        <Dashboard user={session.user} />
      )}
    </div>
  );
}
