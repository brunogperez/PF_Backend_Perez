import { messagesService } from "../services/index.js";
import { logger } from "../utils/logger.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await messagesService.getMessages();
    console.log(messages)
    return res.json({ messages });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ msg: "Contacta al soporte" });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { first_name, last_name } = req;
    const { message } = req.body;

    const fullName = first_name + " " + last_name;

    const result = await messagesService.createMessage(fullName, message);

    return res.json({ result });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ msg: "Contacta al soporte" });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; // El ID del mensaje que queremos eliminar

    const result = await messagesService.deleteMessage(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Mensaje no encontrado" });
    }

    return res.json({ msg: "Mensaje eliminado con éxito" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ msg: "Contacta al soporte" });
  }
};

export const deleteAllMessages = async (req, res) => {
  try {
    const result = await messagesService.deleteAllMessages();

    return res.json({ msg: "Todos los mensajes han sido eliminados" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ msg: "Contacta al soporte" });
  }
};
