export function useCurrentUser() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("currentUser");
  return stored ? JSON.parse(stored) : null;
}