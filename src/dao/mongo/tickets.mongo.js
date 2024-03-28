import ticketModel from "./models/ticket.model.js"

export default class Tickets {

  constructor() { }

  getTicketById = async (id) => ticketModel.findById(id)
  
  getTicketByEmail = async (email) => ticketModel.findOne({ purchase: email })

  createTicket = async (ticket) => await ticketModel.create({...ticket})

}