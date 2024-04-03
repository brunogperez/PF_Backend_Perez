import mongoose from 'mongoose'

const ticketsCollection = 'Ticket';

const TicketSchema = new mongoose.Schema({
    code: { type: String, required: [true, 'El code es obligatorio'] },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: [true, 'El amount (total de la compra) es obligatorio'] },
    purchase: { type: String, required: [true, 'El purchaser (email) es obligatorio'] },
    items: [{ type: Object, required: [true, 'La propiedad items es obligatoria'] }],
});

TicketSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

export default mongoose.model(ticketsCollection, TicketSchema)