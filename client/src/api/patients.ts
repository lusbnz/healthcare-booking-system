import api from "@/lib/api"

export async function bookAppointment(payload: {
    doctor: number
    timeslot: string
    reason: string
}) {
    const res = await api.post("/patients/booking/", payload)
    return res.data
}
  
export async function updateAppointment(id: number, payload: {
    id?: number
    patient?: number
    doctor?: number
    username?: string
    fullname?: string
    email?: string
    timeslot?: string
    reason?: string
    phone_number?: string | null
    user_type?: "doctor" | "patient"
    status?: string
    profile?: null | {
      address?: string | null
      date_of_birth?: string | null
      insurance_number?: string | null
    }
}) {
    const res = await api.put(`/patients/appointments/${id}/`, payload)
    return res.data
}
  
export async function getUserProfile() {
    const res = await api.get("/users/profile/")
    return res.data
}
  
export async function updatePatientProfile(payload: {
    id: number
    username: string
    fullname: string
    email: string
    phone_number: string | null
    user_type: "doctor" | "patient"
    profile: null | {
        address: string | null
        date_of_birth: string | null
        insurance_number: string | null
    }
}) {
    const res = await api.put("/patients/profile/", payload)
    return res.data
}
  
export async function getDoctorsForPatients() {
    const res = await api.get("/patients/doctors/")
    return res.data
}
  
export async function getPatientDashboard() {
    const res = await api.get("/patients/dashboard/")
    return res.data
}
  
export async function getMedicalRecords() {
    const res = await api.get("/patients/medical-records/")
    return res.data
}
  
export async function getAppointments(query: string) {
    const res = await api.get(`/patients/appointments/?${query}`)
    return res.data
}
  
export async function getAppointmentDetail(id: number) {
    const res = await api.get(`/patients/appointments/${id}/`)
    return res.data
}