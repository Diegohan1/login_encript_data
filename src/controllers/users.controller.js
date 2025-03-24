import { getConnection } from '../connection/conection.js';
import sql from 'mssql';
import { createAccessToken } from '../jwt/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../jwt/KEY.js';

export const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(
        'SELECT id, nombre, contraseña, created_at, updated_at FROM tb_usuarios; SELECT SCOPE_IDENTITY() AS id'
      );

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
  }
};

export const getUsersdesencript = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(
        'SELECT id, nombre, dbo.desprotect(CONVERT(VARBINARY(8000), contraseña)) AS decryptPassword, created_at, updated_at FROM tb_usuarios'
      );

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async (req, res) => {
  const pool = await getConnection();
  try {
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM tb_usuarios WHERE id = @id');

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'User not found' });

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
  }
};

export const postUsers = async (req, res) => {
  const pool = await getConnection();
  try {
    /*
    const email = await pool
      .request()
      .input('email', sql.VarChar, req.body.email)
      .query('SELECT id_usuario FROM tb_usuarios WHERE email = @email');

    if (email.recordset.length > 0) {
      return res.status(404).json({ message: 'Correo ya registrado' });
    }
  */
    const result = await pool
      .request()
      .input('nombre', sql.VarChar, req.body.nombre)
      .input('contraseña', sql.VarChar, req.body.contraseña)
      .query(
        'INSERT INTO tb_usuarios (nombre, contraseña) VALUES (@nombre, dbo.protect(@contraseña)); SELECT SCOPE_IDENTITY() AS id'
      );

    const newUserId = result.recordset[0].id;

    const userResult = await pool
      .request()
      .input('id', sql.Int, newUserId)
      .query(
        'SELECT  id, nombre, contraseña, created_at, updated_at FROM tb_usuarios WHERE id = @id'
      );

    const token = await createAccessToken({ id: userResult.recordset[0].id });
    console.log('Token generado:', token);
    res.cookie('token', token);

    res.json(userResult.recordset[0]);
  } catch (error) {
    console.error(error);
  }
};
/*
export const putUsers = async (req, res) => {
  const pool = await getConnection();
  try {
    const encryptedPassword = await pool
      .request()
      .input('password', sql.VarChar, req.body.password)
      .query('SELECT dbo.protect(@password) AS encryptedPassword');

    const result = await pool
      .request()
      .input('id_usuario', sql.Int, req.params.id_usuario)
      .input('username', sql.VarChar, req.body.username)
      .input('email', sql.VarChar, req.body.email)
      .input(
        'password',
        sql.VarBinary,
        encryptedPassword.recordset[0].encryptedPassword
      )
      .query(
        'UPDATE tb_usuarios SET username = @username, email = @email, password = @password WHERE id_usuario = @id_usuario'
      );

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'User not found' });

    return res.json({
      id_usuario: req.params.id_usuario,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, req.params.id_usuario)
      .query('DELETE FROM tb_usuarios WHERE id_usuario = @id_usuario');

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'User not found' });

    return res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
  }
};
*/

export const loginUsers = async (req, res) => {
  const { nombre, contraseña } = req.body;
  const pool = await getConnection();

  try {
    const result = await pool
      .request()
      .input('nombre', sql.VarChar, nombre)
      .query(
        'SELECT id, nombre, dbo.desprotect(CONVERT(VARBINARY(8000), contraseña)) AS decryptPassword, created_at, updated_at FROM tb_usuarios WHERE nombre = @nombre'
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userFound = result.recordset[0];

    if (contraseña !== userFound.decryptPassword) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = await createAccessToken({ id: userFound.id });
    console.log('Token generado:', token); // Revisa si el token contiene el 'id' esperado

    res.cookie('token', token);

    return res.json({
      id: userFound.id,
      nombre: userFound.nombre,
      created_at: userFound.created_at,
      updated_at: userFound.updated_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/*
export const profile = async (req, res) => {
  const pool = await getConnection();
  try {
    console.log('Datos del usuario desde el token:', req.user);

    const result = await pool
      .request()
      .input('id', sql.Int, req.user.id)
      .query(
        'SELECT id, nombre, dbo.desprotect(contraseña) AS contraseña, created_at, updated_at FROM tb_usuarios WHERE id = @id'
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userFound = result.recordset[0];

    return res.json({
      id: userFound.id,
      nombre: userFound.username,
      contraseña: userFound.password,
      created_at: userFound.created_at,
      updated_at: userFound.updated_at,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
*/
export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      expires: new Date(0),
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);

    console.log('Decoded token:', decoded);

    const pool = await getConnection();

    // Consultamos en la base de datos si el usuario existe
    const result = await pool
      .request()
      .input('id', sql.Int, decoded.id) // Aquí usamos 'decoded.id' para consultar en la base de datos
      .query(
        'SELECT id, nombre, created_at, updated_at FROM tb_usuarios WHERE id = @id'
      );

    // Si no encontramos el usuario, respondemos con un error
    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userFound = result.recordset[0]; // El primer usuario encontrado en la base de datos

    // Respondemos con los datos del usuario
    return res.json({
      id: userFound.id, // Aquí usamos 'id' ya que es el campo en la base de datos
      nombre: userFound.nombre,
      created_at: userFound.created_at,
      updated_at: userFound.updated_at,
    });
  } catch (error) {
    console.error('Error en verifyToken:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

/*
export const verifyToken = async (req, res) => {
  try {
    const pool = await getConnection();

    const { token } = req.cookies; // Recuperamos el token desde las cookies

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const result = await pool
      .request()
      .input('id', sql.Int, decoded.id) // 'decoded.id' debe ser el ID del usuario dentro del token
      .query(
        'SELECT id, nombre, created_at, updated_at FROM tb_usuarios WHERE id = @id'
      );

    // Si no encontramos el usuario, respondemos con un error
    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userFound = result.recordset[0];

    // Si el usuario existe, respondemos con sus datos
    return res.json({
      id: userFound.id_usuario,
      nombre: userFound.nombre,
      created_at: userFound.created_at,
      updated_at: userFound.updated_at,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
*/
