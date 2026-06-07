import { expect, type APIResponse } from '@playwright/test';

export async function expectStatus(response: APIResponse, expectedStatus: number): Promise<void> {
  expect(response.status()).toBe(expectedStatus);
}

export async function expectResponseOk(response: APIResponse): Promise<void> {
  expect(response.ok()).toBeTruthy();
}

export async function expectJsonResponse(response: APIResponse): Promise<void> {
  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');
}
