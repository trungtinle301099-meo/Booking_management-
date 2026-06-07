import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(url, { headers });
  }

  async post<TBody>(
    url: string,
    body: TBody,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.post(url, {
      data: body,
      headers,
    });
  }

  async put<TBody>(
    url: string,
    body: TBody,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.put(url, {
      data: body,
      headers,
    });
  }

  async patch<TBody>(
    url: string,
    body: TBody,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.patch(url, {
      data: body,
      headers,
    });
  }

  async delete(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.delete(url, { headers });
  }
}
