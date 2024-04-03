import { Router } from 'express'
import { validarJWT } from '../middlewares/auth.middlewares.js'
import { getTickets } from '../controllers/tickets.controller.js'


const router = Router()

router.get('/', validarJWT, getTickets)

export default router