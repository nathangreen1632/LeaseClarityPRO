import { useAuthStore } from '../store/useAuthStore';

export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  // Read token from Zustand directly (avoids hooks-in-utility warning)
  const token = useAuthStore.getState().token;

  const headers = new Headers(init?.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(input, { ...init, headers });
}
