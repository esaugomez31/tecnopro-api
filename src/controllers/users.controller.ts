import { Request, Response } from "express"
import { matchedData } from "express-validator"

import * as userService from "../services/users.service"
import { IDRoleNotFoundError } from "../errors/role.error"
import { filtersettings } from "../helpers"
import {
  UserActionNotAllowedError,
  UsernameExistsError,
  UserIDNotFoundError,
  EmailExistsError,
} from "../errors/user.error"
import {
  IUser,
  IUserJWT,
  IUserFilters,
  IUserGetCustomRequest,
  IUserCommonRequest,
} from "../interfaces"

export const userSignupController = async (
  req: IUserCommonRequest,
  res: Response,
): Promise<void> => {
  try {
    const body = matchedData<IUser>(req, {
      locations: ["body"],
      includeOptionals: true,
    })
    // Service create user
    const { password: _, ...user } = await userService.userSignup(body)

    res.json(user)
  } catch (error) {
    if (error instanceof UsernameExistsError || error instanceof EmailExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof IDRoleNotFoundError) {
      res.status(400).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const userUpdateController = async (
  req: IUserCommonRequest,
  res: Response,
): Promise<void> => {
  try {
    const idUser = Number(req.params.idUser)
    const jwtData = req.session as IUserJWT
    const body = matchedData<IUser>(req, {
      locations: ["body"],
      includeOptionals: true,
    })
    // Service update user
    const { password: _, ...user } = await userService.userUpdate(body, idUser, jwtData)

    res.json(user)
  } catch (error) {
    if (error instanceof UsernameExistsError || error instanceof EmailExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof IDRoleNotFoundError || error instanceof UserIDNotFoundError) {
      res.status(400).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof UserActionNotAllowedError) {
      res.status(403).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const userUpdateStatusController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const idUser = Number(req.params.idUser)
    const status = Boolean(req.params.status)
    const jwtData = req.session as IUserJWT
    // update status service
    const { password: _, ...user } = await userService.userUpdateStatus(
      idUser,
      status,
      jwtData,
    )

    res.json(user)
  } catch (error) {
    if (error instanceof UserIDNotFoundError) {
      res.status(400).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof UserActionNotAllowedError) {
      res.status(403).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const userGetAllController = async (
  req: IUserGetCustomRequest,
  res: Response,
): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params user
    const params: IUserFilters = {
      username: query.username,
      name: query.name,
      email: query.email,
      phoneNumber: query.phoneNumber,
      status: query.status,
      idRole: query.idRole,
    }

    const users = await userService.userGetAll(params, settings)

    res.json(users)
  } catch (_error) {
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const userGetByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get user id param
    const idUser: number = Number(req.params.idUser)

    const users = await userService.userGetById(idUser)

    res.json(users)
  } catch (_error) {
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}
