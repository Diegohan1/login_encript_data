import { useAuth } from '../context/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Loading.css';

function Protected_Route_Page() {
  const { isAuthenticated } = useAuth();
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (delayedLoading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to='/'
        replace
      />
    );
  }

  return <Outlet />;
}

export default Protected_Route_Page;
