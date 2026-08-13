import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'vr-digital-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
