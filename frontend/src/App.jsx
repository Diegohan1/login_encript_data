import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Login_Page';
import ProfilePage from './pages/Profile_Page';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<HomePage />}
          />
          <Route
            path='/profile'
            element={<ProfilePage />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
