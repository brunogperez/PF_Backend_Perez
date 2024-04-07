import { messagesService } from '../services/index.js'
import { logger } from '../utils/logger.js'

export const getMessages = async (req, res) => {
  try {
    const messages = await messagesService.getMessages()
    return res.json({ messages })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const createMessage = async (req, res) => {

  try {

    const { first_name, last_name } = req
    const { message } = req.body

    const fullName = first_name + ' ' + last_name

    const result = await messagesService.createMessage(fullName, message)

    return res.json({ result })

  } catch (error) {
    logger.error(error)
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }

}


// crear un delete chat