import api from "@/lib/api"

export async function loginUser(payload: {
    username: string
    password: string
  }) {
    const res = await api.post("/users/login/", payload)
    return res.data
}

export async function registerUser(payload: {
    username: string
    email: string
    password: string
    user_type: "doctor" | "patient"
}) {
    const res = await api.post("/users/register/", payload)
    return res.data
}

export async function changePassword(payload: {
    old_password: string
    new_password: string
}) {
    const res = await api.post("/users/changepassword/", payload)
    return res.data
}

export async function getUserProfile() {
    const res = await api.get("/users/profile/")
    return res.data
}

export async function getAllDoctors() {
    const res = await api.get("/users/admin/doctors/")
    return res.data
}