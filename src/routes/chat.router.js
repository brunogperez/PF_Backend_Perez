import { Router } from 'express'
import {
    getMessages,
    createMessage
} from '../controllers/chat.controller.js'
import { validarJWT } from '../middlewares/auth.middlewares.js'

const router = Router()

router.get('/', [
    validarJWT
], getMessages)

router.post('/', [
    validarJWT
], createMessage)

export default router