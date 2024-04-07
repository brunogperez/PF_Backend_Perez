export default class TicketsRepository {
  constructor(dao) {
    this.dao = dao
  }
  getTicketById = async (id) => await this.dao.getTicketById(id)
  getTicketByEmail = async (email) => await this.dao.getTicketByEmail(email)
  getTicketsByEmail = async (email) => await this.dao.getTicketsByEmail(email)
  createTicket = async (ticket) => await this.dao.createTicket(ticket)
}