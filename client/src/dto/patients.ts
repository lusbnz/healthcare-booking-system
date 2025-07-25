export type IPartientProfile = {
    id: number
    username: string
    email: string
    phone_number: string | null
    user_type: "patient"
    profile: {
      address: string
      date_of_birth: string
      insurance_number: string
    }
}