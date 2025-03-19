import { getConnection } from '../connection/conection.js';
import sql from 'mssql';
import { createAccessToken } from '../jwt/jwt.js';

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

    const token = await createAccessToken({ id: userResult.id_usuario });
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
      return res.status(400).json({ message: 'Incorrect user' });
    }

    const token = await createAccessToken({ id: userFound.id_usuario });
    console.log('Token generado:', token);
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
