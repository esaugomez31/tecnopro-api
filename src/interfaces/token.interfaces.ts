export interface IToken {
  idToken?: number
  token?: string | null
  idUser: number
  expiredAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}
