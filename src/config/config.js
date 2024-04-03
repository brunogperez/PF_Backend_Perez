import dotenv from 'dotenv'
import __dirname from '../utils.js'

dotenv.config()

export const PORT = process.env.PORT || 8080
export const MONGO_URL = process.env.MONGO_URL
export const MONGO_DBNAME = process.env.MONGO_DBNAME
export const PERSISTENCE = process.env.PERSISTENCE
export const NODE_ENV = process.env.NODE_ENV
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASS = process.env.MAIL_PASS
export const JWT_CLIENT_ID = process.env.JWT_CLIENT_ID
export const JWT_CLIENT_SECRET = process.env.JWT_CLIENT_SECRET
export const JWT_SIGN = process.env.JWT_CLIENT_SIGN
export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
export const CLOUD_NAME = process.env.CLOUD_NAME
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET
export const URL_RESET_PASS = process.env.URL_RESET_PASS
export const URL_HOME_FRONT = process.env.URL_HOME_FRONT
export const ACCESS_TOKEN_MP = process.env.ACCESS_TOKEN_MP