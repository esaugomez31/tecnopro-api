import express from "express"

import {
  userSignupController,
  userUpdateController,
  userGetAllController,
  userGetByIdController,
  userUpdateStatusController,
} from "../../../controllers/users.controller"
import { UserPermEnum, SystemPageEnum } from "../../../interfaces"
import {
  validateUserSignup,
  validateUserUpdate,
  validateGetUsers,
  validateGetUserById,
  validateUserUpdateStatus,
} from "../../../middlewares/validations"
import { authenticationJWT, checkPermission } from "../../../middlewares"

const routes = express.Router()
const page = SystemPageEnum.USERS

// Get users
routes.get(
  "/",
  authenticationJWT,
  validateGetUsers(),
  checkPermission(page, UserPermEnum.VIEWLIST),
  userGetAllController,
)
routes.get(
  "/:idUser",
  authenticationJWT,
  validateGetUserById(),
  checkPermission(page, UserPermEnum.VIEWLIST),
  userGetByIdController,
)

// User actions
routes.post(
  "/register",
  authenticationJWT,
  validateUserSignup(),
  checkPermission(page, UserPermEnum.CREATE),
  userSignupController,
)
routes.put(
  "/update/:idUser",
  authenticationJWT,
  validateUserUpdate(),
  checkPermission(page, UserPermEnum.UPDATE),
  userUpdateController,
)
routes.put(
  "/:idUser/status/:status",
  authenticationJWT,
  validateUserUpdateStatus(),
  checkPermission(page, UserPermEnum.UPDATESTATUS),
  userUpdateStatusController,
)

export default routes
