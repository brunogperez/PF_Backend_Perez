import supertest from 'supertest'
import { logger } from '../src/utils/logger.js'

const request = supertest('http://127.0.0.1:8080')

describe('Testing Products', () => {
  describe('ProductTest', async () => {
    const { statusCode, ok, body } = await request.get('/api/products/')
    logger.info(statusCode)
    logger.info(ok)
    logger.info(JSON.stringify(body))
  })
})