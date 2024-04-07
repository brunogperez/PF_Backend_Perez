import mongoose from 'mongoose'

const messagesCollection = 'message'
const messageSchema = new mongoose.Schema({
  user: String,
  message: String
})

const messageModel = mongoose.model(messagesCollection, messageSchema)

export default messageModel