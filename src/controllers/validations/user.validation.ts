import { body } from 'express-validator'

export const validateUserCreation = [
  body('name').isString().withMessage('name must be a string').notEmpty().withMessage('name is required'),
  body('username').isString().withMessage('username must be a string').notEmpty().withMessage('username is required'),
  body('password').isString().withMessage('password must be a string').notEmpty().withMessage('password is required'),
  body('email').optional().isEmail().withMessage('must be a valid email').notEmpty().withMessage('email is required'),
  body('phone_number').optional().isString().withMessage('phone number must be a string'),
  body('whatsapp_number').optional().isString().withMessage('whatsapp_number must be a string'),
  body('notifications').optional().isBoolean().withMessage('notifications must be a boolean'),
  body('id_rol').optional().isInt().withMessage('id_rol must be an integer')
]
