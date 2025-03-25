import axios from 'axios';

const conexion = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

export default conexion;
