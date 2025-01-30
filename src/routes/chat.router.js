<<<<<<< HEAD
import { Router } from "express";
import {
  getMessages,
  createMessage,
  deleteMessage,
  deleteAllMessages,
} from "../controllers/chat.controller.js";
import { validarJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/", [validarJWT], getMessages);

router.post("/", [validarJWT], createMessage);

router.delete("/messages/:id", deleteMessage);

router.delete("/messages", deleteAllMessages);

export default router;
=======
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
>>>>>>> 9aeeb92b0c50460d4a6eb62224ae30e0a0fafd32
