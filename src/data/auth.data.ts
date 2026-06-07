import { envConfig } from '../config/env.config';
import type { CreateTokenRequest } from '../types/auth.type';

export const validAuthData: CreateTokenRequest = {
  username: envConfig.bookingUsername,
  password: envConfig.bookingPassword,
};

export const invalidAuthData: CreateTokenRequest = {
  username: 'invalid_user',
  password: 'invalid_password',
};
