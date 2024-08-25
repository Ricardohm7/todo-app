const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const PORT = process.env.PORT || 3000;

export const config = {
  jwtSecret: JWT_SECRET,
  jwtSaltRounds: 10,
  serverPort: PORT,
};
