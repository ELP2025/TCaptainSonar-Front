// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!Cookies.get('token');
      });

  const login = (token: string) => {
        Cookies.set('token', token, { 
        expires: 1, // 1 jour
        secure: true,
        sameSite: 'strict'
      });
      setIsAuthenticated(true);  };

    const logout = () => {
        Cookies.remove('token');
        setIsAuthenticated(false);
      };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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