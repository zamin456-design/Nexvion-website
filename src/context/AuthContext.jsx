import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInUser, 
  signUpUser, 
  signOutUser, 
  isSupabaseConfigured,
  supabase,
  getSupabaseUserProfile,
} from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let authEventId = 0;

    const initAuth = async () => {
      const initialAuthEventId = authEventId;
      try {
        if (isSupabaseConfigured() && supabase) {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (data?.session?.user) {
            const profile = await getSupabaseUserProfile(data.session.user);
            if (active && initialAuthEventId === authEventId) setUser(profile);
            return;
          }
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        if (active && initialAuthEventId === authEventId) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    initAuth();

    if (isSupabaseConfigured() && supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentEventId = ++authEventId;
        if (!session?.user) {
          setUser(null);
          return;
        }

        setTimeout(() => {
          if (!active || currentEventId !== authEventId) return;

          getSupabaseUserProfile(session.user)
            .then((profile) => {
              if (active && currentEventId === authEventId) setUser(profile);
            })
            .catch((err) => {
              console.error('Unable to load signed-in user profile:', err);
              if (active && currentEventId === authEventId) {
                setUser((currentUser) =>
                  currentUser?.id === session.user.id ? currentUser : null
                );
              }
            });
        }, 0);
      });

      return () => {
        active = false;
        listener?.subscription?.unsubscribe();
      };
    }

    return () => {
      active = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await signInUser({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
      return res.user;
    }
    throw new Error('Login failed');
  };

  const signup = async (details) => {
    const res = await signUpUser(details);
    if (res.success && res.user) {
      setUser(res.user);
      return res.user;
    }
    throw new Error('Sign up failed');
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
