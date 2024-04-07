import { messagesService } from '../services'
import { logger } from '../utils/logger'

export const getMessages = async (req, res) => {
  try {
    const messages = await messagesService.getMessages()
    return res.json({ messages })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const createMessage = async () => {
  try {
    const message = await messagesService.createMessage()
    return res.json({ message })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }

}


// crear un delete chat