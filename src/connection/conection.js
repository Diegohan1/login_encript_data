import sql from 'mssql';

const dbSettings = {
  server: 'localhost',
  port: 50779,
  database: 'db_app_tareas',
  user: 'mateo_app_tareas',
  password: 'mateo_app_tareas123456',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.error(error);
  }
};
