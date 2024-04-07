import supertest from 'supertest'
import { logger } from '../src/utils/logger.js'

const request = supertest('http://127.0.0.1:8080')

describe('Testing Users', () => {

  describe('LoginTest', async () => {
    const user = {
      email: 'brunogperez91@gmail.com',
      password: '123123123',
    }
    const { statusCode, ok, body } = await request.post('/api/session/login').send(user)
    logger.info(statusCode)
    logger.info(ok)
    logger.info(JSON.stringify(body))
  });

  describe('RegisterTest', async () => {
    const user = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    }

    const { statusCode, ok, body } = await request.post('/api/session/register').send(user)
    logger.info(statusCode)
    logger.info(ok)
    logger.info(JSON.stringify(body))
  })
})
