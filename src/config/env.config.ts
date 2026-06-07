import dotenv from 'dotenv';

dotenv.config();

type EnvConfig = {
  baseUrl: string;
  bookingUsername: string;
  bookingPassword: string;
};

function getRequiredEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const envConfig: EnvConfig = {
  baseUrl: getRequiredEnv('BASE_URL', 'https://restful-booker.herokuapp.com'),
  bookingUsername: getRequiredEnv('BOOKING_USERNAME', 'admin'),
  bookingPassword: getRequiredEnv('BOOKING_PASSWORD', 'password123'),
};
