import { SupabaseClient } from '@supabase/supabase-js';
import { MOCK_PROFILES } from './constants/mockProfiles';

// ------------------------------------------------------------------
// MOCK SUPABASE CLIENT (LocalStorage & In-Memory)
// ------------------------------------------------------------------
console.log('⚠️ USING MOCK SUPABASE CLIENT (LocalStorage) - No valid Supabase URL provided');

const STORAGE_KEY_SESSION = 'matchfind_mock_session';
const STORAGE_KEY_PROFILES = 'matchfind_mock_profiles';
const STORAGE_KEY_USERS = 'matchfind_mock_users'; // Stores email/password for mock auth

// Event emitter for auth state changes
const authListeners = new Set<(event: string, session: any) => void>();

const notifyAuthListeners = (event: string, session: any) => {
  console.log(`[MockAuth] Event: ${event}`, session);
  authListeners.forEach((listener) => listener(event, session));
};

export const supabase = {
  auth: {
    signInWithOtp: async ({ email }: { email: string }) => {
      console.log(`[MockAuth] Sending OTP to ${email}`);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { error: null };
    },

    signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
      console.log(`[MockAuth] Attempting password login for ${email}`);
      await new Promise((resolve) => setTimeout(resolve, 800));

      let users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}');
      let user = users[email];

      // --- FIX: Fallback to MOCK_PROFILES for testing ---
      if (!user) {
        const mockProfile = MOCK_PROFILES.find(p => p.email === email);
        if (mockProfile && mockProfile.password === password) {
            console.log(`[MockAuth] Found mock profile for ${email}. Auto-registering...`);
            
            // Create the user object
            user = {
                id: mockProfile.id,
                email: mockProfile.email,
                password: mockProfile.password,
                user_metadata: { is_demo: mockProfile.is_demo },
                created_at: new Date().toISOString()
            };

            // Save user to auth storage
            users[email] = user;
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

            // Save profile data to profile storage
            const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY_PROFILES) || '{}');
            profiles[user.id] = { ...mockProfile };
            localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
        }
      }
      // --------------------------------------------------

      if (!user || user.password !== password) {
        console.error('[MockAuth] Invalid credentials');
        return { data: null, error: { message: 'Invalid email or password' } };
      }

      const session = {
        access_token: 'mock-access-token-' + Date.now(),
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: { ...user, id: user.id || 'mock-id-' + Date.now() },
      };

      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      notifyAuthListeners('SIGNED_IN', session);
      return { data: { session }, error: null };
    },

    signUp: async ({ email, password, options }: { email: string, password: string, options: any }) => {
      console.log(`[MockAuth] Signing up ${email}`);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}');
      if (users[email]) {
         return { data: null, error: { message: 'User already exists' } };
      }

      const newUser = {
        id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
        email,
        password, // In real app, never store plain text
        phone: options?.data?.phone,
        created_at: new Date().toISOString(),
      };

      users[email] = newUser;
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

      // Auto login after signup
      const session = {
        access_token: 'mock-access-token-' + Date.now(),
        user: newUser,
      };
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      notifyAuthListeners('SIGNED_IN', session);

      return { data: { session }, error: null };
    },

    signInWithOAuth: async ({ provider }: { provider: string }) => {
        console.log(`[MockAuth] Initiating OAuth with ${provider}`);
        // Simulate redirect flow
        const user = {
            id: 'google-user-' + Math.random().toString(36).substr(2, 9),
            email: 'google_user@example.com',
            aud: 'authenticated',
        };
        const session = { access_token: 'oauth-token', user };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        notifyAuthListeners('SIGNED_IN', session);
        return { data: { url: window.location.href }, error: null };
    },

    verifyOtp: async ({ email, token }: { email: string; token: string }) => {
        // ... previous code ...
        console.log(`[MockAuth] Verifying OTP ${token} for ${email}`);
        await new Promise((resolve) => setTimeout(resolve, 800));
  
        if (!token) return { error: { message: 'Token is required' } };
  
        const user = {
          id: 'mock-otp-user-' + Math.random().toString(36).substr(2, 9),
          email: email,
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        };
  
        const session = {
          access_token: 'mock-access-token-' + Date.now(),
          user: user,
        };
  
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        notifyAuthListeners('SIGNED_IN', session);
  
        return { data: { session }, error: null };
    },

    signOut: async () => {
      console.log('[MockAuth] Signing out');
      localStorage.removeItem(STORAGE_KEY_SESSION);
      notifyAuthListeners('SIGNED_OUT', null);
      return { error: null };
    },

    getSession: async () => {
      const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      return { data: { session }, error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      authListeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(callback);
            },
          },
        },
      };
    },
  },

  from: (table: string) => ({
    upsert: async (data: any) => {
      console.log(`[MockDB] Upserting into '${table}'`, data);
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (table === 'profiles') {
        const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY_PROFILES) || '{}');
        profiles[data.id] = { ...profiles[data.id], ...data };
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
      }
      return { error: null };
    },
    select: () => ({
      eq: (column: string, value: any) => ({
         single: async () => {
            console.log(`[MockDB] Selecting from '${table}' where ${column}=${value}`);
            if (table === 'profiles') {
                const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY_PROFILES) || '{}');
                const profile = profiles[value];
                if (profile) return { data: profile, error: null };
            }
            return { data: null, error: { message: 'Not found', code: 'PGRST116' } };
         }
      })
    })
  }),

  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        // ... (previous upload code) ...
         console.log(`[MockStorage] Uploading to bucket '${bucket}' path '${path}'`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => {
        return {
          data: {
             publicUrl: `https://ui-avatars.com/api/?name=User&background=random` 
          }
        };
      },
    }),
  },
} as unknown as SupabaseClient;
