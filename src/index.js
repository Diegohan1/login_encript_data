import app from './app.js';
import { getConnection } from './connection/conection.js';

getConnection();
app.listen(4000);
console.log('Escuchando en el puerto: ', 4000);
