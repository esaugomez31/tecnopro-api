export interface ILoginResponse {
  accessToken: {
    token: string
    expiresIn: number
  }
  refreshToken: {
    token: string
    expiresIn: number
  }
}
