import { Router } from 'express';
import {
  deleteUsers,
  getUser,
  getUsers,
  loginUsers,
  logout,
  postUsers,
  profile,
  putUsers,
} from '../controllers/users.controller.js';
import { authRequierd } from '../middleware/profile.middleware.js';

const router = Router();

router.get('/user', getUsers);
router.get('/user/:id_usuario', getUser);
router.post('/user', postUsers);
router.put('/user/:id_usuario', putUsers);
router.delete('/user/:id_usuario', deleteUsers);
router.post('/login', loginUsers);
router.get('/profile', authRequierd, profile);
router.post('/logout', logout);

export default router;
