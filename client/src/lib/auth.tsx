import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { setTokens, getAccessToken } from '@/lib/client';
import { ILoginResponse, IRegisterPayload, IUserProfile } from '@/dto/users';
import { getUserProfile, loginUser, registerUser } from '@/api/users';

interface AuthContextType {
  user: IUserProfile | null;
  isLoading: boolean;
  login: (payload: { username: string; password: string }) => Promise<void>;
  register: (payload: IRegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      if (getAccessToken()) {
        try {
          const profile = await getUserProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (payload: { username: string; password: string }) => {
    try {
      const response: ILoginResponse = await loginUser(payload);
      setTokens(response.access, response.refresh);
      const profile = await getUserProfile();
      setUser(profile);
      router.push(`/${profile.user_type}/dashboard`);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (payload: IRegisterPayload) => {
    try {
      await registerUser(payload);
      await login({ username: payload.username, password: payload.password });
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(`/${user.user_type}/dashboard`);
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}