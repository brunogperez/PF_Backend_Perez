
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
