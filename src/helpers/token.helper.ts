import type { AuthService } from '../api/services/auth.service';
import { validAuthData } from '../data/auth.data';

export async function generateAuthToken(authService: AuthService): Promise<string> {
  return authService.getToken(validAuthData);
}
