import bcrypt from 'bcrypt'
import envs from '../config/environment.config'

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, envs.app.password_salt)
}

export const comparePassword = (password: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword)
}
