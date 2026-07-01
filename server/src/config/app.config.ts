import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error(
      'JWT_SECRET environment variable is required. Generate a strong secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
    );
  }

  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  };
});
