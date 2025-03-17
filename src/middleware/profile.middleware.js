import { TOKEN_SECRET } from '../jwt/KEY.js';
import jwt from 'jsonwebtoken';

export const authRequierd = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res
      .status(401)
      .json({ message: 'invalid token, authorization denied' });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token no authorized' });

    console.log('Usuario decodificado:', req.user);
    req.user = user;
    next();
  });
};
