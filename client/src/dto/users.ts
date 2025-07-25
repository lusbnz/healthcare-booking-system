export interface ILoginPayload {
    username: string
    password: string
}
  
export interface ILoginResponse {
    access: string
    refresh: string
}
  
export interface IRegisterPayload {
    username: string
    email: string
    password: string
    user_type: "doctor" | "patient"
}
  
export interface IRegisterResponse {
    username: string
    email: string
    user_type: "doctor" | "patient"
}
  
export interface IChangePasswordPayload {
    old_password: string
    new_password: string
}
  
export interface IChangePasswordResponse {
    detail: string
}
  
export interface IUserProfile {
    id: number
    username: string
    fullname: string
    email: string
    phone_number: string | null
    user_type: "doctor" | "patient"
    profile: null | {
      address: string
      date_of_birth: string
      insurance_number: string
    }
}
  