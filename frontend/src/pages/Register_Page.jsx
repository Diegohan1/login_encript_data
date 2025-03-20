import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/Register_Page.css';

function Register_Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async values => {
    signup(values);
  });

  return (
    <div className='profile-container'>
      <h1 className='profile-title'>¡Únete a nosotros!</h1>
      <p className='profile-description'>
        Regístrate para comenzar a organizar tus tareas y alcanzar tus metas con
        eficiencia. ¡El primer paso hacia el éxito empieza aquí!
      </p>
      <div className='form-container'>
        <div className='form-wrapper'>
          {registerErrors.map((error, i) => (
            <div
              className='alert alert-danger text-center'
              key={i}
            >
              {error}
            </div>
          ))}
          <form
            onSubmit={onSubmit}
            className='profile-form'
          >
            <h2 className='profile-form-title'>Crear Cuenta</h2>
            <div className='input-group'>
              <input
                type='text'
                placeholder='Username'
                {...register('nombre', { required: true })}
                className='form-input'
              />
              {errors.username && (
                <p className='error-message'>Username is required</p>
              )}
            </div>
            <div className='input-group'>
              <input
                type='password'
                placeholder='Password'
                {...register('contraseña', { required: true })}
                className='form-input'
              />
              {errors.password && (
                <p className='error-message'>Password is required</p>
              )}
            </div>

            <button
              type='submit'
              className='submit-btn'
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register_Page;
