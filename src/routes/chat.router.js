import { Router } from "express";
import {
  getMessages,
  createMessage,
  deleteMessage,
  deleteAllMessages,
} from "../controllers/chat.controller.js";
import { validarJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/", getMessages);

router.post("/", createMessage);

router.delete("/:id", deleteMessage);

router.delete("/", deleteAllMessages);

export default router;
