import api from "@/lib/api"

export async function getAllNotifications() {
    const res = await api.get("/notifications/")
    return res.data
  }