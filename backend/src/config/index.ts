const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const config = {
  jwtSecret: JWT_SECRET,
  jwtSaltRounds: 10,
};
