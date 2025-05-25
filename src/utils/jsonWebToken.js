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

export const generateRefreshToken = (user, timeExpire = '7d') => {
  try {
    return jwt.sign({ _id: user._id }, JWT_PRIVATE_KEY, { expiresIn: timeExpire })  
  } catch (error) {
    logger.error(error)
    throw error
  }
}