import { ticketsService } from '../services/index.js'


export const getTickets = async (req, res) => {
    try {
        const email = req.email
        const tickets = await ticketsService.getTicketsByEmail(email)
        return res.json({ tickets })
    } catch (error) {
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}