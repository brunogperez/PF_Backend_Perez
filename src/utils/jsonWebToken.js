import jwt from 'jsonwebtoken'
import { JWT_PRIVATE_KEY } from '../config/config.js'
import { logger } from './logger.js'

export const generateToken = (user, timeExpire = '8h') => {
  try {
    return jwt.sign({ ...user }, JWT_PRIVATE_KEY, { expiresIn: timeExpire })
  } catch (error) {
    logger.error(error)
    throw error
  }
}