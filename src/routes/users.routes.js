import { Router } from 'express';
import {
  getUser,
  getUsers,
  logout,
  postUsers,
  loginUsers,
} from '../controllers/users.controller.js';
import { authRequierd } from '../middleware/profile.middleware.js';

const router = Router();

router.get('/user', getUsers);
router.get('/user/:id', getUser);
router.post('/user', postUsers);
/*
router.put('/user/:id_usuario', putUsers);
router.delete('/user/:id_usuario', deleteUsers);
*/
router.post('/login', loginUsers);
/*
router.get('/profile', authRequierd, profile);
*/
router.post('/logout', logout);

export default router;
