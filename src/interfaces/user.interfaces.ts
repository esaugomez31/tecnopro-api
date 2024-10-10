// src/interfaces/user.interfaces.ts

export interface iCreateUserDto {
  name: string
  username: string
  password: string
  email?: string
  phone_number?: string
  whatsapp_number?: string
  notifications?: boolean
  id_rol?: number | null
}

export interface iUserPublicResponse {
  uuid: string | null
  name: string
  username: string
  email: string | null
  owner: boolean
  phone_number: string | null
  whatsapp_number: string | null
  notifications?: boolean
  last_login: Date | null
  time_zone: string | null
  id_rol?: number | null
}
