export default class TicketsRepository {
  constructor(dao) {
    this.dao = dao
  }
  getTicketById = async (id) => this.dao.findById(id)

  getTicketByEmail = async (email) => this.dao.findOne(email)

  createTicket = async (ticket) => this.dao.createTicket(ticket)
}