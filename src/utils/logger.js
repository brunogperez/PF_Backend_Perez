import winston from 'winston'
import { NODE_ENV } from '../config/config.js'

//const levels = {
//    error: 0,
//    warn: 1,
//    info: 2,
//    http: 3,
//    verbose: 4,
//    debug: 5,
//    silly: 6
//};

const devLogger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
})

const prodLogger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
      format: winston.format.simple()
    }),
  ],
})

export const logger = NODE_ENV === 'PRODUCTION' ? prodLogger : devLogger