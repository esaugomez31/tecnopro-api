import { TokenModel } from "../models"
import { IToken } from "../interfaces"
import { logger } from "../helpers"

export const tokenCreate = async (token: IToken): Promise<IToken> => {
  try {
    // Create token
    const createdToken = await TokenModel.save({ ...token })
    return createdToken
  } catch (error) {
    logger.error("Create token: " + (error as Error).name)
    throw error
  }
}

export const getActiveUSerToken = async (
  idUser: number,
  token?: string,
): Promise<IToken | null> => {
  const tokenUser = await TokenModel.findOne({
    where: { idUser, token, status: true },
  })

  return tokenUser
}

export const deleteTokenById = async (idToken: number): Promise<boolean> => {
  const { affected } = await TokenModel.delete({ idToken })

  return affected !== null && affected !== undefined ? affected > 0 : false
}
