import { useEffect } from 'react';
import { useAuth } from '../context/AuthProvider'; // Importa el hook de contexto
import '../styles/Profile_Page.css';

function Profile_Page() {
  const { usuarios, desencriptarUsuarios, users, desencript, logout } =
    useAuth();

  useEffect(() => {
    if (users.length === 0) {
      usuarios(); // Si no se han cargado los usuarios, obtenlos
    }
  }, [usuarios, users.length]);

  useEffect(() => {
    if (desencript.length === 0) {
      desencriptarUsuarios();
    }
  }, [desencriptarUsuarios, desencript.length]);

  return (
    <div>
      <button
        onClick={logout}
        className='logout-button'
      >
        Cerrar sesión
      </button>
      <h1>Lista de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contraseña</th>
            <th>Fecha de Creación</th>
            <th>Fecha de Actualización</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.contraseña}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>{new Date(user.updated_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='5'>No hay usuarios disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      <h1>Lista de Usuarios Desencriptados</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contraseña</th>
            <th>Fecha de Creación</th>
            <th>Fecha de Actualización</th>
          </tr>
        </thead>
        <tbody>
          {desencript.length > 0 ? (
            desencript.map(desuser => (
              <tr key={desuser.id}>
                <td>{desuser.id}</td>
                <td>{desuser.nombre}</td>
                <td>{desuser.decryptPassword || 'No disponible'}</td>
                <td>{new Date(desuser.created_at).toLocaleDateString()}</td>
                <td>{new Date(desuser.updated_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='5'>No hay usuarios desencriptados disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Profile_Page;
