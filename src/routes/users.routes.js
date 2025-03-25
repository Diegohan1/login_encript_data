import { Router } from 'express';
import {
  getUser,
  getUsers,
  logout,
  postUsers,
  loginUsers,
  verifyToken,
  getUsersdesencript,
} from '../controllers/users.controller.js';
/*
import { authRequierd } from '../middleware/profile.middleware.js';
*/
const router = Router();

router.get('/user', getUsers);

router.get('/desencript', getUsersdesencript);

router.get('/user/:id', getUser);
router.post('/register', postUsers);
/*
router.put('/user/:id_usuario', putUsers);
router.delete('/user/:id_usuario', deleteUsers);
*/

router.post('/login', loginUsers);
/*
router.get('/profile', authRequierd, profile);
*/
router.post('/logout', logout);

router.get('/verify', verifyToken);

export default router;
