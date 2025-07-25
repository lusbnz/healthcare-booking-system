let accessToken: string | null = null
let refreshToken: string | null = null

export function setTokens(access: string, refresh: string) {
  accessToken = access
  refreshToken = refresh
}

export function getAccessToken() {
  return accessToken
}

export async function refreshAccessToken() {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  })

  if (!res.ok) throw new Error("Failed to refresh token")

  const data = await res.json()
  setTokens(data.access, data.refresh)
}