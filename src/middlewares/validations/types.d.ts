import type { ValidationChain } from "express-validator"
import type { RequestHandler } from "express"

type ValidationList = Array<ValidationChain | RequestHandler>
