const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

async function request<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...opts.headers,
    },
    ...opts,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `HTTP ${res.status}`
    );
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, opts?: RequestInit) =>
    request<T>(path, { method: "GET", ...opts }),

  post: <T>(path: string, body: unknown, opts?: RequestInit) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...opts,
    }),

  patch: <T>(path: string, body: unknown, opts?: RequestInit) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...opts,
    }),

  del: <T>(path: string, opts?: RequestInit) =>
    request<T>(path, { method: "DELETE", ...opts }),

  /** Upload multipart/form-data (e.g. audio files) */
  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, {
      method: "POST",
      // Don't set Content-Type — fetch sets it with the boundary automatically
      headers: {},
      body: formData,
    }),
};
