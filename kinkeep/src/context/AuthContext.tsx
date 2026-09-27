'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemoUser: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signInAsDemo: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'kinkeep_demo_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      // 1. Check local demo session first
      if (typeof window !== 'undefined') {
        const localUserStr = localStorage.getItem(LOCAL_USER_KEY);
        if (localUserStr) {
          try {
            const parsed = JSON.parse(localUserStr);
            if (parsed && parsed.id) {
              setUser(parsed);
              setIsDemoUser(true);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error('Failed to parse local user', e);
          }
        }
      }

      // 2. If Supabase is configured, use its session
      if (isSupabaseConfigured) {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setIsDemoUser(false);
          }
        } catch (err) {
          console.error('Error fetching Supabase session:', err);
        }
      }

      if (mounted) {
        setIsLoading(false);
      }
    }

    initializeAuth();

    // 3. Listen to Supabase auth events
    if (isSupabaseConfigured) {
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setIsDemoUser(false);
          setIsLoading(false);
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        setIsDemoUser(false);
        setIsLoading(false);
        return { error: null };
      }

      // Fallback local sign in
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        app_metadata: {},
        user_metadata: { full_name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: email
      } as unknown as User;

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      setIsDemoUser(true);
      setIsLoading(false);
      return { error: null };
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      return { error: msg };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ error: string | null }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName || '' }
          }
        });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        setIsDemoUser(false);
        setIsLoading(false);
        return { error: null };
      }

      // Fallback local sign up
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        app_metadata: {},
        user_metadata: { full_name: fullName || email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: email
      } as unknown as User;

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      setIsDemoUser(true);
      setIsLoading(false);
      return { error: null };
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return { error: msg };
    }
  };

  const signInAsDemo = async (): Promise<void> => {
    setIsLoading(true);
    const demoUser: User = {
      id: 'demo-user-1',
      app_metadata: {},
      user_metadata: { full_name: 'Harper Vance (Family Vault Keeper)' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'harper.vance@kinkeep.family'
    } as unknown as User;

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
    startTransition(() => {
      setUser(demoUser);
      setIsDemoUser(true);
      setIsLoading(false);
    });
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsDemoUser(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isDemoUser,
        signIn,
        signUp,
        signInAsDemo,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
