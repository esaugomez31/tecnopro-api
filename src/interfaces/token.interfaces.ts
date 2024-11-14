export interface IToken {
  idToken?: number
  token: string
  idUser: number
  expiredAt: Date
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}
