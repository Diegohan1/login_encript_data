import { createContext, useContext, useEffect, useState } from 'react';
import {
  desencriptUsuarios,
  loginRequest,
  registerRequest,
  usuariosRequest,
  verifyTokenRequest,
} from '../api/auth';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

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
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [desencript, setDesencript] = useState([]);

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

  const usuarios = async () => {
    try {
      const users = await usuariosRequest();
      setUsers(users.data);
      console.log(users);
    } catch (error) {
      console.error(error);
    }
  };

  const desencriptarUsuarios = async () => {
    try {
      const response = await desencriptUsuarios(); // Llama a la API para obtener los usuarios desencriptados
      setDesencript(response.data); // Guarda los datos desencriptados en el estado
      console.log(response.data); // Muestra los datos desencriptados en la consola (opcional)
    } catch (error) {
      console.error('Error al obtener usuarios desencriptados:', error);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

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
        console.log(error);
      }
    }
    CheckLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logout,
        signup,
        signin,
        usuarios,
        desencriptarUsuarios,
        user,
        users,
        loading,
        isAuthenticated,
        errors,
        desencript,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
