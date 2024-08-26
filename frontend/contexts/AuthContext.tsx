import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

interface LoginParams {
  accessToken: string;
  user: {
    id: string;
    username: string;
  };
}

interface AuthContextType {
  accessToken: string | null;
  login: ({accessToken, user}: LoginParams) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  user: {id: string; username?: string} | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userState, setUserState] = useState<{
    id: string;
    username?: string;
  } | null>(null);

  const login = ({accessToken, user}: LoginParams) => {
    setAccessToken(accessToken);
    setUserState(user);
  };

  const logout = async () => {
    setAccessToken(null);
    setUserState(null);
    // Call backend to invalidate refresh token
    await fetch('/api/auth/logout', {method: 'POST', credentials: 'include'});
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // This is important for sending cookies
      });
      if (response.ok) {
        const {accessToken, user} = await response.json();
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('user', JSON.stringify(user));
        setAccessToken(accessToken);
        setUserState(user);
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Retrieve value from sessionStorage
      const accessToken = sessionStorage.getItem('accessToken');
      const user = sessionStorage.getItem('user');
      if (accessToken && user) {
        setAccessToken(accessToken);
        setUserState(JSON.parse(user));
      } else {
        refreshToken();
      }
    }
  }, []);
  console.log('accessToken', accessToken);

  return (
    <AuthContext.Provider
      value={{accessToken, login, logout, refreshToken, user: userState}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
