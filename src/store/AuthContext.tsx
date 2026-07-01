import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer } from '../types';

interface AuthState {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (phone: string) => Promise<boolean>;
  register: (data: { name: string; phone: string; email?: string; whatsapp?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Customer>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    customer: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const savedId = localStorage.getItem('ag_customer_id');
    if (savedId) {
      loadCustomer(savedId);
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const loadCustomer = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        localStorage.removeItem('ag_customer_id');
        setState({ customer: null, isLoading: false, isAuthenticated: false });
      } else {
        setState({ customer: data, isLoading: false, isAuthenticated: true });
      }
    } catch {
      setState({ customer: null, isLoading: false, isAuthenticated: false });
    }
  };

  const login = async (phone: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error || !data) {
        return false;
      }

      localStorage.setItem('ag_customer_id', data.id);
      setState({ customer: data, isLoading: false, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  };

  const register = async (data: {
    name: string;
    phone: string;
    email?: string;
    whatsapp?: string;
  }): Promise<boolean> => {
    try {
      const { data: customer, error } = await supabase
        .from('customers')
        .insert([data])
        .select()
        .single();

      if (error || !customer) {
        return false;
      }

      localStorage.setItem('ag_customer_id', customer.id);
      setState({ customer, isLoading: false, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('ag_customer_id');
    setState({ customer: null, isLoading: false, isAuthenticated: false });
  };

  const updateProfile = async (data: Partial<Customer>) => {
    if (!state.customer) return;

    const { error } = await supabase
      .from('customers')
      .update(data)
      .eq('id', state.customer.id);

    if (!error) {
      setState((prev) => ({
        ...prev,
        customer: prev.customer ? { ...prev.customer, ...data } : null,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
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
