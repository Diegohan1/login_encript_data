import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from './KEY.js';

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: '1d',
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

/*
export function createAccessToken(payload, id_role_verification_token, id_verification_token) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        user_id: payload.id,                      
        id_role: payload.role_id,                  
        id_role_verification: id_role_verification_token, 
        id_verification: id_verification_token    
      },
      TOKEN_SECRET,
      {
        expiresIn: "1d",                          
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

*/
