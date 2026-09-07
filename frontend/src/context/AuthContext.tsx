import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, fullName: string, role?: UserRole) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loginAsDemo: (role: UserRole) => void;
  isStudent: boolean;
  isOfficer: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check local storage for persistent demo/cached user
    const cached = localStorage.getItem('placeiq_active_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    // Default demo user so the app is immediately testable without requiring email verification
    return {
      id: 'demo-student-01',
      email: 'student@campus.edu',
      full_name: 'Arjun Sharma',
      role: 'student',
    };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Query profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const activeUser: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: profile?.full_name || session.user.user_metadata?.full_name || 'Campus Student',
          role: (profile?.role || session.user.user_metadata?.role || 'student') as UserRole,
          avatar_url: profile?.avatar_url,
        };
        setUser(activeUser);
        localStorage.setItem('placeiq_active_user', JSON.stringify(activeUser));
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      const activeUser: UserProfile = {
        id: data.user.id,
        email: data.user.email || '',
        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
        role: (data.user.user_metadata?.role || 'student') as UserRole,
      };
      setUser(activeUser);
      localStorage.setItem('placeiq_active_user', JSON.stringify(activeUser));
    }
    setLoading(false);
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, role: UserRole = 'student') => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    if (!error && data.user) {
      const activeUser: UserProfile = {
        id: data.user.id,
        email: data.user.email || '',
        full_name: fullName,
        role: role,
      };
      setUser(activeUser);
      localStorage.setItem('placeiq_active_user', JSON.stringify(activeUser));
    }
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('placeiq_active_user');
  };

  const loginAsDemo = (role: UserRole) => {
    let demoUser: UserProfile;
    if (role === 'officer') {
      demoUser = {
        id: 'demo-officer-01',
        email: 'officer@campus.edu',
        full_name: 'Dr. Priya Nair (Placement Head)',
        role: 'officer',
      };
    } else if (role === 'admin') {
      demoUser = {
        id: 'demo-admin-01',
        email: 'admin@campus.edu',
        full_name: 'Campus Administrator',
        role: 'admin',
      };
    } else {
      demoUser = {
        id: 'demo-student-01',
        email: 'student@campus.edu',
        full_name: 'Arjun Sharma (Final Year CSE)',
        role: 'student',
      };
    }
    setUser(demoUser);
    localStorage.setItem('placeiq_active_user', JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        loginAsDemo,
        isStudent: user?.role === 'student',
        isOfficer: user?.role === 'officer' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
