import api from "@/lib/api"

export async function getDoctorProfile() {
    const res = await api.get("/doctors/profile/")
    return res.data
}

export async function updateDoctorProfile(payload: {
    fullname: string
    email: string
    phone_number: string
    specialty: string
    address: string
    license_number: string
}) {
    const res = await api.put("/doctors/profile/", payload)
    return res.data
}
  
export async function getDoctorAppointments() {
    const res = await api.get("/doctors/appointments/")
    return res.data
}
  
export async function confirmAppointment(id: number) {
    const res = await api.post(`/doctors/appointments/${id}/confirm/`)
    return res.data
}
  
export async function cancelAppointment(id: number) {
    const res = await api.post(`/doctors/appointments/${id}/cancel/`)
    return res.data
}