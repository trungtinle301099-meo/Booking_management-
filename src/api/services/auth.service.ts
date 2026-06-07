import type { APIResponse } from '@playwright/test';
import type { ApiClient } from '../clients/api-client';
import { authEndpoint } from '../endpoints/auth.endpoint';
import type { CreateTokenRequest, CreateTokenResponse } from '../../types/auth.type';
import { createTokenResponseSchema } from '../../schemas/booking.schema';

export class AuthService {
  constructor(private readonly apiClient: ApiClient) {}

  async createToken(payload: CreateTokenRequest): Promise<APIResponse> {
    return this.apiClient.post(authEndpoint.createToken, payload);
  }

  async getToken(payload: CreateTokenRequest): Promise<string> {
    const response = await this.createToken(payload);
    const body = (await response.json()) as CreateTokenResponse;
    const parsed = createTokenResponseSchema.parse(body);

    return parsed.token;
  }
}
