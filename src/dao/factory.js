import { PERSISTENCE } from '../config/config.js'

export let Carts
export let Products
export let Users
export let Messages
export let Tickets

switch (PERSISTENCE) {

  case 'MONGO':

    const { default: CartsMongo } = await import('./mongo/carts.mongo.js')
    const { default: ProductsMongo } = await import('./mongo/products.mongo.js')
    const { default: UsersMongo } = await import('./mongo/users.mongo.js')
    const { default: MessagesMongo } = await import('./mongo/messages.mongo.js')
    const { default: TicketsMongo } = await import('./mongo/tickets.mongo.js')

    Carts = CartsMongo
    Products = ProductsMongo
    Users = UsersMongo
    Messages = MessagesMongo
    Tickets = TicketsMongo

    break
    
  default:
    throw new Error('Persistence is not defined')
}