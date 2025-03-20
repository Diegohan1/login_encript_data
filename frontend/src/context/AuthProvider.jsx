import { createContext, useContext, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  /*
  const [loading, setLoading] = useState(true);
  */
  const signup = async user => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setIsAuthenticated(true);
      setUser(res.data);
      setErrors([]);
    } catch (error) {
      console.log(error.response);

      if (Array.isArray(error.response.data)) {
        setErrors([error.response.data[0]]);
      } else if (typeof error.response.data === 'string') {
        setErrors([error.response.data]);
      } else if (error.response.data.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['An uknown error ocurred']);
      }
    }
  };

  const signin = async user => {
    try {
      const res = await loginRequest(user);
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setErrors([error.response.data[0]]);
      } else if (typeof error.response.data === 'string') {
        setErrors([error.response.data]);
      } else if (error.response.data.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['An unknown error ocurred']);
      }
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUser(null);
  };
  /*

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  */
  /*
  useEffect(() => {
    async function CheckLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    CheckLogin();
  }, []);

  */

  return (
    <AuthContext.Provider
      value={{
        logout,
        signup,
        signin,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
