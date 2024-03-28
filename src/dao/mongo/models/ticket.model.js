import mongoose from 'mongoose'
import crypto from 'crypto'

const ticketsCollection = 'ticket'

const ticketSchema = new mongoose.Schema({
  code: { type: String, default: crypto.randomBytes(20).toString('hex') },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: [true, 'El amount (total de la compra) es obligatorio'] },
  purchaser: { type: String, required: [true, 'El purchase (email) es obligatorio'] },
  items: [{ type: Object, required: [true, 'La propiedad items es obligatoria'] }]
});

ticketSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
})

export default mongoose.model(ticketsCollection, ticketSchema)