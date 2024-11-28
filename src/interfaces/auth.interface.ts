import { IUserPublicResponse } from './user.interfaces'
export interface ILoginResponse {
  accessToken: {
    token: string
    expiresIn: number
  }
  refreshToken: {
    token: string
    expiresIn: number
  }
  user: IUserPublicResponse
}
