export default class MessagesRepository {
  constructor(dao) {
<<<<<<< HEAD
    this.dao = dao;
  }

  getMessages = async () => await this.dao.getMessages();

  createMessage = async (user, message) =>
    await this.dao.createMessage(user, message);
  deleteMessage = async (id) => await this.dao.deleteMessage(id);
  deleteAllMessages = async () =>
    await this.dao.deleteAllMessages();
=======
    this.dao = dao
  }

  getMessages = async () => await this.dao.getMessages()
  
  createMessage = async (user, message) => await this.dao.createMessage(user, message)

>>>>>>> 9aeeb92b0c50460d4a6eb62224ae30e0a0fafd32
} 