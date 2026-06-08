import type { APIRequestContext, APIResponse } from '@playwright/test';
import { apiStabilityGuard } from '../flaky/api-stability.guard';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    return apiStabilityGuard.run(() => this.request.get(url, { headers }), {
      method: 'GET',
      url,
    });
  }

  async post<TBody>(
    url: string,
    body: TBody,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    return apiStabilityGuard.run(
      () =>
        this.request.post(url, {
          data: body,
          headers,
        }),
      {
        method: 'POST',
        url,
      },
    );
  }

  async put<TBody>(
    url: string,
    body: TBody,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    return apiStabilityGuard.run(
      () =>
        this.request.put(url, {
          data: body,
          headers,
        }),
      {
        method: 'PUT',
        url,
      },
    );
  }

  async patch<TBody>(
    url: string,
    body: TBody,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    return apiStabilityGuard.run(
      () =>
        this.request.patch(url, {
          data: body,
          headers,
        }),
      {
        method: 'PATCH',
        url,
      },
    );
  }

  async delete(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    return apiStabilityGuard.run(() => this.request.delete(url, { headers }), {
      method: 'DELETE',
      url,
    });
  }
}
