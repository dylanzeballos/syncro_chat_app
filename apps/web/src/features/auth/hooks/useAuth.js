import { useState, useEffect } from "react";
import { supabase } from "../../../config/supabase";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.access_token) {
          const expiresAt = currentSession.expires_at * 1000;
          const now = Date.now();
          const fiveMinutes = 5 * 60 * 1000;

          if (expiresAt - now < fiveMinutes) {
            await refreshSession();
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {

      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refrescando sesión:', error);
        await signOut();
        return null;
      }
      return data.session;
    } catch (error) {
      console.error('Error refrescando sesión:', error);
      await signOut();
      return null;
    }
  };

  const getValidToken = async () => {
    if (!session) return null;

    const expiresAt = session.expires_at * 1000;
    const now = Date.now();
    const oneMinute = 60 * 1000;

    if (expiresAt - now < oneMinute) {
      const newSession = await refreshSession();
      return newSession?.access_token || null;
    }

    return session.access_token;
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error iniciando sesión con Google:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    signInWithGoogle,
    getValidToken,
    refreshSession,
  };
};
