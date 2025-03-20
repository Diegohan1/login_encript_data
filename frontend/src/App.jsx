import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login_Page from './pages/Login_Page';
import ProfilePage from './pages/Profile_Page';
import { AuthProvider } from './context/AuthProvider';
import Register_Page from './pages/Register_Page';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<Login_Page />}
          />
          <Route
            path='/profile'
            element={<ProfilePage />}
          />
          <Route
            path='/register'
            element={<Register_Page />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
