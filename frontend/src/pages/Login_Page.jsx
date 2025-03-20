import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import '../styles/Login_Page.css';

function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin, errors: signinErrors, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const onSubmit = handleSubmit(data => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/profile');
  }, [isAuthenticated, navigate]);

  return (
    <div className='homepage-container'>
      <h1 className='homepage-title'>¡Bienvenido de nuevo!</h1>
      <p className='homepage-description'>
        Inicia sesión para gestionar tus pendientes y mantenerte al día con tus
        tareas. ¡Nosotros nos encargamos de que todo esté bajo control!
      </p>
      <div className='form-container'>
        <div className='col-md-6 col-lg-4'>
          {signinErrors.map((error, i) => (
            <div
              className='alert alert-danger text-center'
              key={i}
            >
              {error}
            </div>
          ))}
          <form
            className='login-form'
            onSubmit={onSubmit}
          >
            <h2 className='form-title'>Login</h2>
            <div className='input-group'>
              <input
                type='text'
                placeholder='Nombre'
                {...register('nombre', { required: true })}
                className='form-input'
              />
              {errors.nombre && (
                <p className='error-message'>El Nombre es obligatorio</p>
              )}
            </div>
            <div className='input-group'>
              <input
                type='password'
                placeholder='Contraseña'
                {...register('contraseña', { required: true })}
                className='form-input'
              />
              {errors.contraseña && (
                <p className='error-message'>La contraseña es obligatoria</p>
              )}
            </div>
            <button
              type='submit'
              className='submit-btn'
            >
              Iniciar sesión
            </button>
          </form>
          <p className='signup-link'>
            ¿No tienes cuenta?{' '}
            <Link
              to='/register'
              className='signup-link-text'
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
