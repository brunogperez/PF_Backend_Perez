import ticketModel from './models/ticket.model.js'

export default class Tickets {

  constructor() { }

  getTicketById = async (id) => await ticketModel.findById(id)
  getTicketByEmail = async (email) => await ticketModel.findOne({ purchase:email })
  getTicketsByEmail = async (email) => await ticketModel.find({ purchase:email })
  createTicket = async (ticket) => await ticketModel.create({ ...ticket })
}