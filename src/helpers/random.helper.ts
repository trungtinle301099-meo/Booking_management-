export function randomString(prefix = 'auto'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function randomPrice(min = 1, max = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
