import messageModel from "./models/messages.model.js";

export default class Messages {
  constructor() {}

  getMessages = async () => messageModel.find().lean().exec();

  createMessage = async (user, message) =>
    messageModel.create({ user, message });

  deleteMessage = async (id) => {
    return messageModel.deleteOne(id);
  };
  deleteAllMessages = async () => {
    return messageModel.deleteMany({});
  };
}
