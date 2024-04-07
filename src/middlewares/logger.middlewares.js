import { logger } from '../utils/logger.js'

export const requestUrl = (req, res, next) => {
    logger.http(`${req.method}: ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}