import axios from './axios.js';

export const registerRequest = user => axios.post('/register', user);

export const loginRequest = user => axios.post('/login', user);

export const verifyTokenRequest = () => axios.get('/verify');

export const usuariosRequest = () => axios.get('/user');

export const desencriptUsuarios = () => axios.get('/desencript');
