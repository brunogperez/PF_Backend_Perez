import mongoose from 'mongoose'
import { logger } from '../utils/logger.js'
import { MONGO_DBNAME, MONGO_URL } from '../config/config.js'


export const mongoDBConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL, { dbName: MONGO_DBNAME })
    logger.info('DB Connected!')
  } catch (error) {
    logger.error('ERROR TRYING TO CONNECT MONGO DB')
    process.exit(1)
  }
}