import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });

  const urlBackend = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorsState | null>(null);
  const navigate = useNavigate();

  const [user, setUser] = useState<DecodedToken | null>(() => {
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      try {
        const tokens: AuthTokens = JSON.parse(storedTokens);
        const decodedToken: DecodedToken = jwtDecode(tokens.access);
        return decodedToken;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  });

  const loginUser = async (formData: LoginProps): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${urlBackend}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({
          notAuth: data.detail || "Las credenciales son inválidas.",
        });
        return false;
      }

      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));

      return true;
    } catch (error) {
      setError({ notAuth: 'Ocurrió un error inesperado.' });
      return false;
    } finally {
      setLoading(false);
    }
  };


  const changeMonitorPassword = async (userId: number, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${urlBackend}/api/users/${userId}/change_password/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({
          notAuth: data.detail || "Las credenciales son inválidas.",
        });
        return false;
      }

      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));

      return true;
    } catch (error) {
      setError({ notAuth: 'Ocurrió un error inesperado.' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('authTokens');
    requestAnimationFrame(() => {
      navigate('/ingresar');
    });
  };

  const handleUnauthorized = () => {
    logoutUser();
    navigate("/ingresar", { replace: true });
  };
  
  // Verificar token
  useEffect(() => {
    if (authTokens) {
      try {
        const decodedToken: DecodedToken = jwtDecode(authTokens.access);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          logoutUser();
        }
      } catch (error) {
        console.error('Error verifying token expiration:', error);
      }
    }
  }, [authTokens]);

  
  return (
    <AuthContext.Provider value={{
      user,
      authTokens,
      loginUser,
      handleUnauthorized,
      changeMonitorPassword,
      logoutUser,
      error,
      loading
    }}>
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