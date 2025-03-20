import { useAuth } from '../context/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

function Protected_Route_Page() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <h1>Loading...</h1>;

  if (!loading && !isAuthenticated)
    return (
      <Navigate
        to='/'
        replace
      />
    );
  return <Outlet />;
}

export default Protected_Route_Page;
