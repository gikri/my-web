const API_BASE_URL = process.env.FASTAPI_URL ?? ''

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = (body as { error?: { message?: string } })?.error?.message
      ?? `API error: ${res.status} ${res.statusText}`
    throw new Error(message)
  }
  return res.json() as Promise<T>
}
