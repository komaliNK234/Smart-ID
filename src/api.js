const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
const defaultApiBase = import.meta.env.DEV
  ? ''
  : 'https://smart-id-backend-pr3y.onrender.com';

export async function apiRequest(path, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };
  const response = await fetch(`${configuredApiBase ?? defaultApiBase}${path}`, {
    ...options,
    headers,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`The server returned an invalid response (${response.status}).`);
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed (${response.status}).`);
  }

  return payload;
}
