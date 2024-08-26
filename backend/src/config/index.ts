const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const PORT = process.env.PORT || 3000;
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

export const config = {
  jwtSecret: JWT_SECRET,
  jwtRefreshToken: REFRESH_TOKEN_SECRET,
  jwtSaltRounds: 10,
  serverPort: PORT,
};
