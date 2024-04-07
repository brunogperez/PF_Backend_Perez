import { Router } from 'express'
import {
    getMessages,
    createMessage
} from '../controllers/chat.controller'

const router = Router()

router.get('/', getMessages)

router.post('/',createMessage)

export default router