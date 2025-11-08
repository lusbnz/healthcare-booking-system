export function setTokens(access: string, refresh: string) {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export async function refreshAccessToken() {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Failed to refresh token");
    }

    if (data.access) {
      setTokens(data.access, refreshToken);
      return data.access;
    } else {
      throw new Error("No access token in response");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Không tự động chuyển hướng ở đây
    throw error;
  }
}